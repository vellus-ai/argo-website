import Header from "@/components/header";
import Hero from "@/components/hero";
import SocialProof from "@/components/social-proof";
import Crew from "@/components/crew";
import HowItWorks from "@/components/how-it-works";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import CTABanner from "@/components/cta-banner";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <Crew />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
