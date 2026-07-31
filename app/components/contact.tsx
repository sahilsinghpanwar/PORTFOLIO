'use client';

import { useRef, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Send, CheckCircle, Loader2, Mail, User, MessageSquare, ArrowRight } from 'lucide-react';
import { sendContactEmail } from '@/app/actions/sendEmail';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function InputField({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  rows,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);

  const baseClass = `
    w-full bg-white/[0.02] border rounded-xl px-4 py-3.5 text-white text-sm
    placeholder:text-white/20 transition-all duration-300 cursor-text
    ${focused
      ? 'border-white/30 bg-white/[0.05] shadow-[0_0_0_3px_rgba(255,255,255,0.05)]'
      : error
        ? 'border-rose-500/50'
        : 'border-white/[0.06] hover:border-white/[0.12]'
    }
  `;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 select-none">
        <Icon size={10} className="text-white/30" />
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
        />
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 font-mono tracking-wider select-none mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      const response = await sendContactEmail({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        message: form.message,
      });

      if (response.success) {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        console.error("Failed to send message:", response.error);
        setStatus('error');
      }
    } catch (err) {
      console.error("Network dispatch error:", err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" ref={ref} className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-[#000000]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.01] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-12 gap-16 items-center"
        >
          <div className="lg:col-span-5">
            <motion.div
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] select-none"
            >
              <span className="w-1 h-1 rounded-full bg-white animate-ping shadow-[0_0_6px_#ffffff]" />
              <span className="font-mono text-[9px] tracking-[0.35em] text-white/50 uppercase">
                Get in Touch
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter uppercase select-none mb-6 flex flex-col"
            >
              <span className="text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.08)]">
                LET&apos;S BUILD
              </span>
              <span
                className="mt-1"
                style={{
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
                  color: 'transparent',
                }}
              >
                SOMETHING GREAT
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-white/50 text-sm sm:text-base leading-relaxed mb-10 max-w-sm font-light"
            >
              Have a project in mind? Want to collaborate or just say hello? Drop me a message — I typically respond within 24 hours.
            </motion.p>

            <motion.div variants={stagger} className="flex flex-col gap-4">
              {[
                {
                  label: 'Email',
                  value: 'sahilpanwar0211@gmail.com',
                  href: 'mailto:sahilpanwar0211@gmail.com',
                  icon: Mail,
                },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  variants={fadeUp}
                  href={item.href}
                  className="flex items-center gap-4 group cursor-none w-fit"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                    <item.icon size={15} className="transition-transform group-hover:scale-105" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase leading-none mb-1">{item.label}</p>
                    <p className="text-white/80 text-sm font-semibold group-hover:text-white transition-colors">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}

              <motion.div variants={fadeUp} className="pt-6 border-t border-white/[0.04] mt-2 max-w-xs">
                <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase mb-3">Availability</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a78bfa] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#a78bfa]"></span>
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.2em] text-[#a78bfa] font-bold uppercase">
                    Open to opportunities
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="relative rounded-3xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-3xl p-6 sm:p-10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center select-none"
                >
                  <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mb-5 border border-violet-500/20">
                    <CheckCircle size={26} className="text-[#a78bfa]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/40 text-sm max-w-xs font-light leading-relaxed">
                    Thanks for reaching out. I will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-white/50 hover:text-white uppercase underline underline-offset-4 cursor-none"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField
                      label="First Name"
                      id="firstName"
                      placeholder="Sahil"
                      value={form.firstName}
                      onChange={handleChange('firstName')}
                      error={errors.firstName}
                      icon={User}
                    />
                    <InputField
                      label="Last Name"
                      id="lastName"
                      placeholder="Panwar"
                      value={form.lastName}
                      onChange={handleChange('lastName')}
                      error={errors.lastName}
                      icon={User}
                    />
                  </div>

                  <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="sahil@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                    icon={Mail}
                  />

                  <InputField
                    label="Message"
                    id="message"
                    placeholder="Tell me about your project or idea..."
                    value={form.message}
                    onChange={handleChange('message')}
                    error={errors.message}
                    icon={MessageSquare}
                    rows={5}
                  />

                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    whileHover={{ scale: status === 'loading' ? 1 : 1.01 }}
                    whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/95 hover:scale-[1.01] active:scale-95 transition-all duration-300 shadow-[0_4px_25px_rgba(255,255,255,0.15)] group cursor-none disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
