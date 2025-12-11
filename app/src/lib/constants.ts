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
  },
  {
    name: "Melissa Lee",
    role: "Product Manager",
    company: "BrightLoop",
    quote:
      "I stopped overthinking. The voice drills and debriefs were gold. I feel calm and present now.",
    avatarInitials: "ML",
  },
  {
    name: "Jordan Patel",
    role: "Strategy Consultant",
    company: "North & Co",
    quote:
      "Upcoming Date Prep was scary accurate. I knew what to say and when to listen.",
    avatarInitials: "JP",
  },
  {
    name: "Sofia Ramirez",
    role: "Designer",
    company: "First Date Labs",
    quote:
      "Juliet feels like a warm, direct coach in my ear. I can jump into any conversation without rehearsing in the mirror.",
    avatarInitials: "SR",
  },
  {
    name: "Chris Howard",
    role: "Sales Lead",
    company: "Velar",
    quote:
      "The Weekly Challenges keep things fun. I’m finally bringing my best self to every first date.",
    avatarInitials: "CH",
  },
];

export const problemSolution: ProblemSolution = {
  oldWay: [
    "Awkward pauses and stalled small talk",
    "Endless swiping, few real dates",
    "No feedback, so mistakes repeat",
    "Overthinking and low confidence",
    "Time wasted on bad prep",
  ],
  newWay: [
    "Real-time voice practice with near-instant replies (<150ms target)",
    "Warm AI coaching and exact phrasing tips",
    '"Upcoming Date Prep" that mimics who you\'re meeting',
    "Measurable progress and session memory across weeks",
    "Practice with your type in fun, real scenarios",
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
    { label: "Login", href: "/login" },
    { label: "Quiz", href: "/quiz" },
  ],
  cta: { label: "Get Early Access", href: "/#waitlist" },
};

export const faqs: FaqItem[] = [
  {
    question: "Will this feel awkward?",
    answer:
      "Juliet's warm coaching style and the low-pressure Weekly Challenges make practice feel natural and engaging instead of forced.",
  },
  {
    question: "Is my voice and data private?",
    answer:
      "We built a privacy-first experience. Your voice data is used only to improve your sessions and isn't shared with third parties.",
  },
  {
    question: "Does this actually improve real dates?",
    answer:
      "Engaged members typically see a 25–30% uplift in second-date conversion within about a month of regular practice.",
  },
  {
    question: "How much time does it take?",
    answer:
      "Most people do 3–10 minutes a day. Quick drills before a date can be just a few minutes, with longer sessions when you want them.",
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
        { label: "How it Works", href: "#how-it-works" },
        { label: "Benefits", href: "#benefits" },
        { label: "FAQ", href: "#faq" },
        { label: "Quiz", href: "/quiz" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Contact", href: "mailto:support@firstdatelabs.com" },
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
    { platform: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { platform: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { platform: "Twitter", href: "https://twitter.com", icon: "twitter" },
    { platform: "TikTok", href: "https://www.tiktok.com", icon: "tiktok" },
  ],
  contact: "",
};
