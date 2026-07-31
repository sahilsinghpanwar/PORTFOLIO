import Navbar from './components/navbar';
import Hero from './components/hero';
import About from './components/about';
import Projects from './components/projects';
import TechStack from './components/tech-stack';
import Contact from './components/contact';
import Footer from './components/footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
