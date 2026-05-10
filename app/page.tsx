import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturesStrip from '@/components/FeaturesStrip';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturesStrip />
      <Portfolio />
      <Contact />
      <Footer />
    </>
  );
}
