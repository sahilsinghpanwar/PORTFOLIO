'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Cosine Palette for liquid chrome / silver metallic finish
const paletteGLSL = `
  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b * cos(6.28318 * (c * t + d));
  }
`;

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vDist;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uScrollProgress;

  // Simplex 3D noise
  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.0*x_);
    vec4 x = x_*ns.x + ns.yyyy;
    vec4 y = y_*ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1),
                                   dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1),
                            dot(x2,x2), dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0*dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

  float fbm(vec3 p){
    float v = 0.0;
    float a = 0.5;
    for(int i=0;i<5;i++){
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vUv = uv;

    vec3 pos = position;
    vec3 p = pos * 1.25;
    float t = uTime * 0.15;

    // Organic domain warped liquid flow waves
    float warp1 = fbm(p + vec3(t, -t * 0.8, t * 0.4));
    float warp2 = snoise(p * 1.8 + vec3(-t * 0.5, t * 0.7, t * 0.3));
    float warp = warp1 * 0.22 + warp2 * 0.08;

    // Displacement along vertex normal for sculpted geometry structure
    float ridge = max(0.0, 1.0 - abs(snoise(p * 1.4)));
    float disp = warp + ridge * 0.12;
    vDist = disp;
    pos += normal * disp;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorldPos = world.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vDist;

  uniform float uTime;
  uniform vec2  uMouse;

  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform vec3 uColorTertiary;
  uniform vec3 uAccent;

  ${paletteGLSL}

  float saturate(float x){ return clamp(x, 0.0, 1.0); }

  // Recompute geometric normal from screen space derivatives for specular lighting highlights on displaced surfaces
  vec3 normalFromDerivatives(vec3 p){
    vec3 dx = dFdx(p);
    vec3 dy = dFdy(p);
    return normalize(cross(dx, dy));
  }

  // Fresnel term
  vec3 F_Schlick(float cosTheta, vec3 F0){
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
  }

  // GGX microfacet distribution
  float D_GGX(float NdotH, float rough){
    float a = rough * rough;
    float a2 = a * a;
    float d = (NdotH * NdotH) * (a2 - 1.0) + 1.0;
    return a2 / (3.14159 * d * d);
  }

  float G_SchlickGGX(float NdotV, float rough){
    float r = rough + 1.0;
    float k = (r * r) / 8.0;
    return NdotV / (NdotV * (1.0 - k) + k);
  }

  float G_Smith(float NdotV, float NdotL, float rough){
    return G_SchlickGGX(NdotV, rough) * G_SchlickGGX(NdotL, rough);
  }

  // Environment lighting simulation (smooth sky to ground gradient)
  vec3 envGradient(vec3 r, vec3 skyA, vec3 skyB, vec3 ground){
    float h = r.y * 0.5 + 0.5;
    vec3 sky = mix(skyB, skyA, h);
    return mix(ground, sky, saturate(h * 1.2));
  }

  float gradParam(vec2 uv, float time){
    vec2 q = uv * 2.0 - 1.0;
    q.x *= 1.2;
    float a = sin(q.x * 2.0 + time * 0.15);
    float b = cos(q.y * 2.5 - time * 0.1);
    return saturate(0.5 + 0.5 * (a * 0.6 + b * 0.4));
  }

  void main(){
    vec3 N = normalFromDerivatives(vWorldPos);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // Three premium cinematic lights revolving around the mesh
    float t = uTime * 0.4;
    vec3 L1pos = vec3(5.0 * sin(t * 0.6), 3.5, 5.0 * cos(t * 0.6));
    vec3 L2pos = vec3(-6.0 * cos(t * 0.4), -3.0, 6.0 * sin(t * 0.4));
    vec3 L3pos = vec3(0.0, 5.0 * sin(t * 0.2), -5.0);

    vec3 L1 = normalize(L1pos - vWorldPos);
    vec3 L2 = normalize(L2pos - vWorldPos);
    vec3 L3 = normalize(L3pos - vWorldPos);

    float gp = gradParam(vUv, uTime) + vDist * 0.5;

    // Elite titanium chrome cosine palette
    vec3 palBase = cosPalette(
      gp,
      vec3(0.5, 0.5, 0.5),      // silver center
      vec3(0.5, 0.5, 0.5),      // white highlights
      vec3(1.0, 1.0, 1.0),      // frequency
      vec3(0.0, 0.1, 0.2)       // iridescent shifts
    );

    // Blend base metallic albedo with input design tokens
    vec3 baseAlbedo = mix(palBase, uColorPrimary, 0.08);
    baseAlbedo = mix(baseAlbedo, uColorSecondary, 0.06);

    float metallic = 0.85 + 0.1 * sin(uTime * 0.15);
    float rough    = clamp(0.12 + 0.08 * sin(gp * 5.0 + uTime * 0.2), 0.05, 0.35);

    vec3 F0 = mix(vec3(0.04), baseAlbedo, metallic);

    // Light setups
    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);
    vec3 H3 = normalize(V + L3);

    float NdotV = saturate(dot(N, V));
    float NdotL1= saturate(dot(N, L1));
    float NdotL2= saturate(dot(N, L2));
    float NdotL3= saturate(dot(N, L3));

    float NdotH1= saturate(dot(N, H1));
    float NdotH2= saturate(dot(N, H2));
    float NdotH3= saturate(dot(N, H3));

    float D1 = D_GGX(NdotH1, rough);
    float D2 = D_GGX(NdotH2, rough);
    float D3 = D_GGX(NdotH3, rough);

    float G1 = G_Smith(NdotV, NdotL1, rough);
    float G2 = G_Smith(NdotV, NdotL2, rough);
    float G3 = G_Smith(NdotV, NdotL3, rough);

    vec3 F1 = F_Schlick(saturate(dot(V, H1)), F0);
    vec3 F2 = F_Schlick(saturate(dot(V, H2)), F0);
    vec3 F3 = F_Schlick(saturate(dot(V, H3)), F0);

    vec3 spec1 = (D1 * G1 * F1) / max(4.0 * NdotV * NdotL1, 0.001);
    vec3 spec2 = (D2 * G2 * F2) / max(4.0 * NdotV * NdotL2, 0.001);
    vec3 spec3 = (D3 * G3 * F3) / max(4.0 * NdotV * NdotL3, 0.001);

    vec3 kS = F_Schlick(NdotV, F0);
    vec3 kD = (vec3(1.0) - kS) * (1.0 - metallic);
    vec3 diffuse = baseAlbedo / 3.14159;

    vec3 c1 = vec3(1.0);
    vec3 c2 = mix(uColorTertiary, vec3(0.9, 0.95, 1.0), 0.7);
    vec3 c3 = mix(uAccent, vec3(1.0, 0.9, 0.8), 0.5);

    vec3 direct =
      (kD * diffuse + spec1) * c1 * NdotL1 * 1.1 +
      (kD * diffuse + spec2) * c2 * NdotL2 * 0.7 +
      (kD * diffuse + spec3) * c3 * NdotL3 * 0.6;

    // Simulated environment mapping
    vec3 R = reflect(-V, N);
    vec3 env = envGradient(R,
      vec3(0.18, 0.20, 0.28), // zenith
      vec3(0.04, 0.05, 0.08), // horizon
      vec3(0.00, 0.00, 0.00)  // ground
    );
    vec3 Fenv = F_Schlick(saturate(dot(N, V)), F0);
    vec3 envSpec = Fenv * env * (1.0 - rough) * 0.8;

    // Glowing rim outlines (Fresnel spotlight effect)
    float rim = pow(1.0 - saturate(dot(N, V)), 2.5);
    vec3 rimCol = mix(uAccent, uColorSecondary, 0.3) * rim * 0.45;

    // Organic displacement glow
    vec3 glow = mix(uAccent, uColorPrimary, 0.5) * abs(vDist) * 0.3;

    vec3 finalColor = direct + envSpec + rimCol + glow;

    // Shimmer effect
    float shimmer = sin(vUv.x * 50.0 + uTime * 0.8) * sin(vUv.y * 45.0 - uTime * 0.8);
    finalColor += shimmer * 0.01;

    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
  }
`;

// Postprocessing cinematic grading shader (vignette + fine film grain)
const cinematicPostShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uContrast: { value: 1.08 },
    uSaturation: { value: 1.02 },
    uVignette: { value: 0.40 },
    uAberration: { value: 0.0015 },
    uGrain: { value: 0.18 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform float uContrast, uSaturation, uVignette, uAberration, uGrain;

    float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }

    vec3 aces(vec3 x){
      float a=2.51, b=0.03, c=2.43, d=0.59, e=0.14;
      return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
    }

    vec3 satContrast(vec3 c, float sat, float con){
      vec3 g = vec3(dot(c, vec3(0.299, 0.587, 0.114)));
      c = mix(g, c, sat);
      c = (c - 0.5) * con + 0.5;
      return c;
    }

    void main(){
      vec2 p = vUv - 0.5;
      vec2 dir = normalize(p + 1e-6);
      float dist = length(p);
      vec2 off = dir * uAberration * dist;

      float r = texture2D(tDiffuse, vUv + off).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - off).b;
      vec3 col = vec3(r, g, b);

      // Fine analog film grain overlay
      float n = rand(vUv * vec2(uResolution.x, uResolution.y) + uTime * 45.0) - 0.5;
      col += n * uGrain * 0.06;

      col = satContrast(col, uSaturation, uContrast);

      float vig = smoothstep(0.9, 0.25, dist);
      col *= mix(1.0, vig, uVignette);

      col = aces(col);
      col = pow(col, vec3(1.0 / 2.2));

      gl_FragColor = vec4(col, 1.0);
    }
  `
};

export default function Ethereal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let composer: EffectComposer;
    let mesh: THREE.Mesh;
    let clock = new THREE.Clock();
    let frameId: number;

    const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || 450;
    const height = rect.height || 450;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Elite subdivision structure
    const geometry = new THREE.IcosahedronGeometry(1.6, 5);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uScrollProgress: { value: 0 },
        uColorPrimary: { value: new THREE.Color('#ffffff') },   // Glowing titanium-white primary
        uColorSecondary: { value: new THREE.Color('#a3a3a3') }, // Silver secondary
        uColorTertiary: { value: new THREE.Color('#262626') },  // Dark graphite carbon
        uAccent: { value: new THREE.Color('#ffffff') }          // Intense white specular
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Post processing stack
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // High fidelity unreal bloom for space neon light glows
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.65, // strength
      0.40, // radius
      0.90  // threshold
    );
    composer.addPass(bloom);

    const cinePass = new ShaderPass(cinematicPostShader);
    cinePass.uniforms.uResolution.value.set(width, height);
    composer.addPass(cinePass);

    const handleMouseMove = (e: MouseEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      mouse.x = (e.clientX - bounds.left) / bounds.width;
      mouse.y = 1.0 - (e.clientY - bounds.top) / bounds.height;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const w = bounds.width;
      const h = bounds.height;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      composer.setSize(w, h);

      cinePass.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse updates
      mouse.sx += (mouse.x - mouse.sx) * 0.08;
      mouse.sy += (mouse.y - mouse.sy) * 0.08;

      if (mesh) {
        const shaderMat = mesh.material as THREE.ShaderMaterial;
        shaderMat.uniforms.uTime.value = t;
        shaderMat.uniforms.uMouse.value.set(mouse.sx, mouse.sy);

        // Breathing floating kinetics
        mesh.position.y = Math.sin(t * 0.5) * 0.05;
        mesh.rotation.y = t * 0.08;
        mesh.rotation.x = Math.sin(t * 0.2) * 0.1;
      }

      cinePass.uniforms.uTime.value = t;
      composer.render();
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-black/5 rounded-3xl border border-white/[0.05]">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden bg-black/10 border border-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-sm select-none cursor-none flex items-center justify-center"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* High-tech matrix blueprint guidelines */}
      <div className="absolute top-4 left-4 text-[9px] font-mono text-white/20 select-none pointer-events-none">+ SEC_02</div>
      <div className="absolute top-4 right-4 text-[9px] font-mono text-white/20 select-none pointer-events-none">MATRIX</div>
      <div className="absolute bottom-4 left-4 text-[9px] font-mono text-white/20 select-none pointer-events-none">3D_MESH</div>
      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-white/20 select-none pointer-events-none">GL_COORD</div>

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
