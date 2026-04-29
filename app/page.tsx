import Hero from "@/components/sections/Hero";
import Cases from "@/components/sections/Cases";
import Diferencial from "@/components/sections/Diferencial";
import Ofertas from "@/components/sections/Ofertas";
import ComoComecamos from "@/components/sections/ComoComecamos";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import CookieBanner from "@/components/CookieBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Cases />
      <Diferencial />
      <Ofertas />
      <ComoComecamos />
      <FAQ />
      <FinalCTA />
      <Footer />
      <CookieBanner />
    </>
  );
}
