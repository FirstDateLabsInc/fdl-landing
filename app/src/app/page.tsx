import { HeroSection } from "@/components/sections/HeroSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
// import { HowAppWorksSection } from "@/components/sections/HowAppWorksSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <div id="contact" aria-hidden className="sr-only" />
      <SocialProofSection />
      <ProblemSolutionSection />
      <BenefitsSection />
      {/* TODO: Re-enable once “How it works” content is finalized */}
      {/* <HowAppWorksSection /> */}
      <FAQSection />
      <FinalCTASection />
      <div id="login" aria-hidden className="sr-only" />
    </div>
  );
}
