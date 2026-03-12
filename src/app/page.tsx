import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HeroCTA from "../components/HeroCTA";
import About from "../components/About";
import Services from "../components/Services";
import Equipment from "../components/Equipment";
import Portfolio from "../components/Portfolio";
import Contact from "../components/Contact";
import ContactVideo from "../components/ContactVideo";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HeroCTA />
      <About />
      <Services />
      <Equipment />
      <Portfolio />
      <Contact />
      <ContactVideo />
      <Footer />
      <ScrollToTop />
    </>
  );
}
