import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import PageBlur from "./components/PageBlur";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Fixed bottom blur — follows viewport as user scrolls */}
      <PageBlur />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

