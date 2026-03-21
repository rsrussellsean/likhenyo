import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import BelowHero from "@/components/landing/BelowHero";
import HowItWorks from "@/components/landing/HowItWorks";
import ProfessionGrid from "@/components/landing/ProfessionGrid";
import WhyLikhenyo from "@/components/landing/WhyLikhenyo";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import ForThePhilippines from "@/components/landing/ForThePhilippines";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BelowHero />
        <HowItWorks />
        <ProfessionGrid />
        <WhyLikhenyo />
        <Stats />
        <Testimonials />
        <ForThePhilippines />
      </main>
      <Footer />
    </>
  );
}
