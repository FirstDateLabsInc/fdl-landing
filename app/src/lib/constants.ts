export type Cta = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string[];
  description: string;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export type LandingSection = {
  id: string;
  title: string;
  summary: string;
  anchorLabel: string;
};

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarInitials: string;
  avatarImage?: string;
};

export type Navigation = {
  logoText: string;
  links: { label: string; href: string }[];
  cta: Cta;
};

export type ProblemSolution = {
  oldWay: string[];
  newWay: string[];
};

export type Benefit = {
  title: string;
  description: string;
  icon: "sparkles" | "message" | "heart" | "trending";
};

export type HowItWorksStep = {
  number: number;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FinalCtaContent = {
  headline: string;
  subheadline: string;
  socialProof: string;
  quizCta: Cta;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterContent = {
  tagline: string;
  columns: FooterColumn[];
  social: { platform: string; href: string; icon: "linkedin" | "instagram" | "twitter" | "tiktok" }[];
  contact: string;
  brandName: string;
};

export const heroContent: HeroContent = {
  eyebrow: "Built for intentional daters",
  title: ["Get more dates", "Build real connections"],
  description:
    "Meet Juliet: an AI dating coach that helps you practice real first-date conversations, get instant feedback, and prepare for your next date—so you can build meaningful connections.",
  primaryCta: { label: "Get Early Access", href: "#waitlist" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
};

export const landingSections: LandingSection[] = [
  {
    id: "hero",
    title: "Hero",
    summary: "Headline and CTA introduction",
    anchorLabel: "Top",
  },
  {
    id: "social-proof",
    title: "Testimonials",
    summary: "Stories from Juliet members",
    anchorLabel: "Social Proof",
  },
  {
    id: "problem-solution",
    title: "Problem vs Solution",
    summary: "Compare old vs new ways",
    anchorLabel: "Problem/Solution",
  },
  {
    id: "benefits",
    title: "Benefits",
    summary: "Key Juliet advantages",
    anchorLabel: "Benefits",
  },
  {
    id: "how-it-works",
    title: "How it Works",
    summary: "Four-step process",
    anchorLabel: "How it Works",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Evan Walker",
    role: "Senior Engineer",
    company: "Coreline",
    quote:
      "As an engineer, I was great at details and bad at small talk. Juliet made the first five minutes easy. I’m getting more second dates.",
    avatarInitials: "EW",
    avatarImage: "/images/avatars/evan-walker.png",
  },
  {
    name: "Melissa Lee",
    role: "Product Manager",
    company: "BrightLoop",
    quote:
      "I stopped overthinking. The voice drills and debriefs were gold. I feel calm and present now.",
    avatarInitials: "ML",
    avatarImage: "/images/avatars/melissa-lee.png",
  },
  {
    name: "Jordan Patel",
    role: "Strategy Consultant",
    company: "North & Co",
    quote:
      "Upcoming Date Prep was scary accurate. I knew what to say and when to listen.",
    avatarInitials: "JP",
    avatarImage: "/images/avatars/jordan-patel.png",
  },
  {
    name: "Sofia Ramirez",
    role: "Designer",
    company: "First Date Labs",
    quote:
      "Juliet feels like a warm, direct coach in my ear. I can jump into any conversation without rehearsing in the mirror.",
    avatarInitials: "SR",
    avatarImage: "/images/avatars/sofia-ramirez.png",
  },
  {
    name: "Chris Howard",
    role: "Sales Lead",
    company: "Velar",
    quote:
      "The Weekly Challenges keep things fun. I’m finally bringing my best self to every first date.",
    avatarInitials: "CH",
    avatarImage: "/images/avatars/chris-howard.png",
  },
];

export const problemSolution: ProblemSolution = {
  // THE OLD WAY: Anxiety, dead-end chats, zero feedback, wasted time
  oldWay: [
    "Pre-date anxiety that tanks your confidence before you even arrive",
    "Conversations that die after \"So, what do you do?\"",
    "Ghosted again—with zero feedback on what went wrong",
    "Hours lost overthinking every message you send",
    "Dating feels like a draining chore, not an exciting adventure",
  ],
  // THE NEW WAY: Real results that users actually experience
  newWay: [
    "73% of users hear \"When can I see you again?\" after their dates",
    "No more awkward silences—you always know what to say next",
    "Friends start asking: \"You seem different lately. More confident.\"",
    "2x more second dates within your first 3 weeks",
    "Text them first—without drafting 10 versions in your notes app",
  ],
};

export const benefits: Benefit[] = [
  {
    title: "Keep the conversation flowing",
    description:
      "Daily voice drills help you navigate any topic and stay present instead of spiraling into silence.",
    icon: "message",
  },
  {
    title: "Translate practice to real dates",
    description:
      "Role-play with realistic partners so your new skills show up effortlessly when it matters.",
    icon: "sparkles",
  },
  {
    title: "Get personalized coaching",
    description:
      "Juliet adapts to your goals, nudging you with phrasing tips, prompts, and tone feedback.",
    icon: "heart",
  },
  {
    title: "Track second-date uplift",
    description:
      "Measure your progress session-by-session and watch your second-date rate climb week over week.",
    icon: "trending",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: 1,
    title: "Fast onboarding + goals",
    description: "Set intentions and tell Juliet who you want to become on your next dates.",
  },
  {
    number: 2,
    title: "Daily voice practice",
    description:
      "Choose your Dating Practice Partner and rehearse real scenarios with responsive dialogue.",
  },
  {
    number: 3,
    title: "Upcoming Date Prep",
    description:
      "Simulate the real person you\'re about to meet so you\'re calm, confident, and ready.",
  },
  {
    number: 4,
    title: "Smart debrief",
    description:
      "Review actionable insights, track improvements, and unlock weekly challenges tailored to you.",
  },
];

export type WalkthroughStep = {
  number: number;
  title: string;
  description: string;
  image: string;
};

export const howAppWorksSteps: WalkthroughStep[] = [
  {
    number: 1,
    title: "Fast onboarding + goals",
    description:
      "Set intentions and tell Juliet who you want to become on your next dates.",
    image: "/walkthrough/step-1-onboarding.svg",
  },
  {
    number: 2,
    title: "Daily voice practice",
    description:
      "Choose your Dating Practice Partner and rehearse real scenarios with responsive dialogue.",
    image: "/walkthrough/step-2-practice.svg",
  },
  {
    number: 3,
    title: "Upcoming Date Prep",
    description:
      "Simulate the real person you're about to meet so you're calm, confident, and ready.",
    image: "/walkthrough/step-3-date-prep.svg",
  },
  {
    number: 4,
    title: "Smart debrief",
    description:
      "Review actionable insights, track improvements, and unlock weekly challenges tailored to you.",
    image: "/walkthrough/step-4-debrief.svg",
  },
];

export const navigation: Navigation = {
  logoText: "First Date Labs",
  links: [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
    // { label: "Login", href: "/login" },
    { label: "Quiz", href: "/quiz" },
  ],
  cta: { label: "Get Early Access", href: "/#waitlist" },
};

export const faqs: FaqItem[] = [
  {
    question: "Will I sound scripted or fake on my dates?",
    answer:
      "No. Juliet builds your natural conversation skills—not scripts. Users consistently say they feel 'more like themselves,' not like they're performing.",
  },
  {
    question: "How is this different from reading dating advice online?",
    answer:
      "Reading and doing are completely different. Juliet lets you practice with your actual voice in real-time, building muscle memory. That's why 73% of users feel more confident on real dates.",
  },
  {
    question: "I'm busy. How much time does this actually take?",
    answer:
      "5 minutes a day is enough. Most users practice during their commute, on a walk, or right before a date. No schedule, no pressure.",
  },
  {
    question: "How soon will I notice a difference?",
    answer:
      "Most users feel more confident within the first week. By week 3, they're averaging 2x more second dates than before.",
  },
  {
    question: "Is my voice and conversation data private?",
    answer:
      "100%. Your data is only used to improve your experience—never shared with third parties. Privacy-first, always.",
  },
];

export const finalCtaContent: FinalCtaContent = {
  headline: "Ready to ace your next date?",
  subheadline:
    "Stop guessing and start connecting. Get exclusive access and build the confidence to handle any date with ease.",
  socialProof: "Join 2,500+ singles already on the waitlist",
  quizCta: { label: "Take the free quiz", href: "/quiz" },
};

export const footerContent: FooterContent = {
  tagline: "Your AI dating coach for meaningful connections",
  brandName: "First Date Labs",
  columns: [
    {
      title: "Product",
      links: [
        { label: "How it Works", href: "/#how-it-works" },
        { label: "Benefits", href: "/#benefits" },
        { label: "FAQ", href: "/#faq" },
        { label: "Quiz", href: "/quiz" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
  social: [
    { platform: "LinkedIn", href: "https://www.linkedin.com/company/first-date-labs/", icon: "linkedin" },
    { platform: "Instagram", href: "https://www.instagram.com/firstdatelabs?igsh=eDgzZ3BleDh1NnU4&utm_source=qr", icon: "instagram" },
    { platform: "Twitter", href: "https://x.com/firstdatelabs", icon: "twitter" },
    { platform: "TikTok", href: "https://www.tiktok.com/@firstdatelabs?_r=1&_t=ZT-928jHCWaI2g", icon: "tiktok" },
  ],
  contact: "",
};
