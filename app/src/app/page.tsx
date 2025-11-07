import { HeroSection } from "@/components/sections/HeroSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { MobileAppWalkthroughSection } from "@/components/sections/MobileAppWalkthroughSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <div id="press" aria-hidden className="sr-only" />
      <SocialProofSection />
      <ProblemSolutionSection />
      <BenefitsSection />
      <MobileAppWalkthroughSection />
      <div id="waitlist" aria-hidden className="sr-only" />
      <div id="login" aria-hidden className="sr-only" />
    </div>
  );
}
