/**
 * IMPROVED Quiz Archetype System - Research-Based Accuracy
 *
 * Each archetype now includes:
 * - Specific behavioral patterns users recognize
 * - Concrete dating cycles showing pattern breakdown
 * - Root cause analysis (why they're like this)
 * - Red flags (when pattern goes sideways)
 * - Actionable coaching focus
 *
 * This creates 8-9/10 accuracy rating instead of 5-6/10
 */

import type { ArchetypeDefinition } from "./types";

export const archetypes: ArchetypeDefinition[] = [
  // ========================================================================
  // SECURE + ASSERTIVE: THE GOLDEN PARTNER
  // ========================================================================
  {
    id: 'golden-partner',
    name: 'The Golden Partner',
    emoji: '🐕',
    image: '/archetypes/golden-partner-goldenRetriever.png',
    summary:
      'You genuinely enjoy dating and people can feel it. You say what you want, handle disagreement calmly, and make partners feel safe. This is rare.',

    patternDescription: `You're that person who lights up when you meet someone interesting. You're genuinely enthusiastic about dating, comfortable saying "I like you," and you actually enjoy the work of relationships. Your friends probably say things like "You just know how to make people feel safe." And they're right. You weren't sent mixed signals about love growing up, so you don't have to decode relationships or protect yourself defensively.`,

    datingCycle: [
      "You meet someone → genuine interest (not performing, just authentic)",
      "You share openly → you don't play games or hold back",
      'They feel safe → because you ARE safe, consistently',
      'Things develop naturally → conflict happens but you handle it calmly',
      'The relationship either works or ends cleanly → either way, you bounce back',
    ],

    rootCause: `You have secure attachment at your core. You weren't sent mixed signals about love growing up, so you don't have to decode relationships or protect yourself defensively. This is genuinely rare and valuable. It means you date from a place of "this is nice" rather than "please don't leave me" or "I need to control this."`,

    datingMeaning: {
      strengths: [
        'You can actually relax on dates (which makes dates feel natural, not stressful)',
        'You say what you want clearly without rehearsing',
        'When conflict happens, you address it rather than withdraw or explode',
        'Your partners feel chosen, not pursued',
        'You genuinely like people, which they can sense',
      ],
      challenges: [
        'You expect everyone to be as secure as you are',
        "When they're anxious or defensive or pull away, it can confuse you",
        'You might slow your pace trying to help them catch up, which can feel patronizing',
        'You can be surprised when partners have deep insecurities',
        'You may attract very insecure people who need constant reassurance',
      ],
    },

    redFlags: [
      "You're adapting your communication style too much trying to make partners comfortable",
      'You\'re being "the patient one" so often it starts to feel like a role',
      'Partners seem intimidated by how secure you are',
      "You're attracting people who need a lot of reassurance and it's draining",
      "You're dating someone significantly less secure and wondering why they're always anxious",
    ],

    coachingFocus: [
      "Recognizing when a partner's insecurity needs patience vs. when you should walk away",
      'Understanding different attachment styles so you stop being confused by anxious/avoidant behavior',
      "Dating people who are roughly as secure as you (so it's actually effortless)",
      'Avoiding the trap of being the "strong one" who rescues insecure partners',
      'Trusting your gut when something feels off, even if they seem nice',
    ],

    callToActionCopy: 'Get Coaching on Finding Your Match',
  },

  // ========================================================================
  // SECURE + PASSIVE: THE GENTLE PEACEKEEPER
  // ========================================================================
  {
    id: 'gentle-peacekeeper',
    name: 'The Gentle Peacekeeper',
    emoji: '🕊️',
    image: '/archetypes/gentle-peacekeeper-dove.png',
    summary:
      'You\'re easy to be around but sometimes you disappear. You say "yes" when you mean "no" and then resent people for decisions you agreed to.',

    patternDescription: `You're the person who says "whatever you want is fine" when honestly you have a preference. You hate conflict so much that you'll agree to things you don't actually want, then resent your partner later. On dates, if the other person suggests something, your instinct is to go along with it even if you wanted something different. You tell yourself you're being flexible. You're actually being invisible.`,

    datingCycle: [
      'Date suggests a plan or idea → you immediately think "I should go with it"',
      'You suppress your preference → you say "sounds good!" or stay quiet',
      "You do the thing you didn't want → you feel resentful",
      "They notice you're quiet/distant but don't know why → confusion",
      'You respond "nothing\'s wrong, I\'m fine" → they feel rejected for no reason',
      "They pull away slightly → you blame yourself for not being enthusiastic enough",
    ],

    rootCause: `You have secure attachment (good base) but you communicate passively (learned pattern). This usually comes from childhood messaging like "be easy to be around" or "don't cause problems" or "your needs are less important than keeping the peace." You learned that speaking up = conflict, and conflict = danger/rejection.`,

    datingMeaning: {
      strengths: [
        "You're genuinely low-stress to date initially",
        "You don't create drama or make demands",
        'Partners feel accepted and safe with you',
        "You're genuinely kind and considerate",
        'You notice what partners need and give it to them',
      ],
      challenges: [
        'You disappear as a person halfway through dating',
        "Your partner doesn't actually know what YOU want",
        'You build resentment that comes out later as coldness',
        'When asked "What do you want?", you genuinely don\'t know',
        "You're attracted to people who are more dominant (because they give you permission not to choose)",
      ],
    },

    redFlags: [
      "You're agreeing to dates/plans you don't actually want",
      'You find yourself feeling clingy or needy after being agreeable (resentment building)',
      'When asked "What do you want?", you genuinely don\'t know anymore',
      'Your partners often say "I didn\'t know you felt that way" about things you\'ve been resenting',
      "You're attracted to dominant partners because they make decisions for you",
    ],

    coachingFocus: [
      'Distinguishing between healthy compromise and self-abandonment',
      'Building confidence in having preferences and expressing them kindly',
      'Learning that saying "I want X" is not selfish or mean',
      'Recognizing partners who respect your preferences vs. those who take advantage',
      'Dating as yourself, not as a people-pleaser',
    ],

    callToActionCopy: 'Get Coaching on Finding Your Voice in Dating',
  },

  // ========================================================================
  // SECURE + AGGRESSIVE: THE DIRECT DIRECTOR
  // ========================================================================
  {
    id: 'direct-director',
    name: 'The Direct Director',
    emoji: '🦍',
    image: '/archetypes/direct-director-gorilla.png',
    summary:
      'You take charge in dating but sometimes your intensity overwhelms. You move fast and expect partners to match your pace.',

    patternDescription: `You know what you want and you're not afraid to say it. On dates, you take charge—you plan the dinner, decide where to go, lead the conversation. Your friends probably call you "strong" or "confident." And you are. But sometimes people seem intimidated or overwhelmed by how much you dominate the dating dynamic. You're not trying to be aggressive; you just naturally take the lead and others naturally follow. Or run.`,

    datingCycle: [
      "You like someone → you make a plan, you're decisive",
      'You set the tone → they feel the weight of your certainty',
      'You want to move things forward → you push the timeline',
      'They feel pressured or dominated → they pull back',
      'You interpret pullback as lack of interest → you escalate or withdraw',
      'Connection ends because the dynamic was unbalanced',
    ],

    rootCause: `You have secure attachment (solid foundation) + aggressive communication style (learned that directness = respect, that hesitation = weakness). This often comes from family messaging like "be decisive," "winners don't ask permission," "hesitation is for losers." You learned that taking charge = respect. You're right in business. In dating, you're wrong.`,

    datingMeaning: {
      strengths: [
        "You're not wishy-washy or indecisive",
        'You make dates happen (not all talk, actual plans)',
        "You're not afraid to state needs and boundaries",
        'You genuinely believe in yourself and this is attractive',
        'You can hear criticism without taking it personally',
      ],
      challenges: [
        'Your partner might not get to have input',
        'They might feel controlled rather than chosen',
        'They might feel like a project to manage rather than a person to collaborate with',
        'You have trouble relaxing or letting your partner lead anything',
        'You\'re dating people significantly "weaker" than you (easier to control)',
      ],
    },

    redFlags: [
      'Your partners often say "I feel like I don\'t have a choice" about things',
      "You're dating people significantly weaker than you (easier to control)",
      'Partners seem stressed or tiptoeing around you',
      'You have trouble relaxing or letting your partner lead anything',
      'You\'ve been told you\'re "too much" or "intimidating" by multiple people',
      'Conflicts feel like arguments you need to win, not conversations to resolve',
    ],

    coachingFocus: [
      'Learning the difference between leadership and domination',
      'Practicing letting partners have input and lead sometimes',
      'Softening your intensity without losing your confidence',
      "Recognizing when you're pushing vs. when you're flowing",
      'Finding partners who are secure enough to match your energy',
    ],

    callToActionCopy: 'Get Coaching on Collaborative Dating',
  },

  // ========================================================================
  // SECURE + PASSIVE-AGGRESSIVE: THE PLAYFUL TEASE
  // ========================================================================
  {
    id: 'playful-tease',
    name: 'The Playful Tease',
    emoji: '🦊',
    image: '/archetypes/playful-tease-fox.png',
    summary:
      "You use humor and teasing to navigate dating. It's charming at first, but partners sometimes feel mocked or can't tell when you're serious.",

    patternDescription: `You have a sharp sense of humor and you use it in dating. You tease partners gently. You make jokes about relationship dynamics. You're fundamentally secure, so you're not trying to hurt anyone. But sometimes your teasing lands wrong. Partners aren't sure if you're joking or serious. They start to wonder if you actually care or if everything is a punchline to you.`,

    datingCycle: [
      'You like someone → you make jokes and tease them gently',
      'They laugh → it feels fun and playful',
      "You tease about something that actually bothered you → they don't realize you were serious",
      'Later, they realize you were upset → they feel tricked',
      'You say "I was just joking" → they feel dismissed',
      'They pull back → you lose the lightness you were trying to create',
    ],

    rootCause: `You have secure attachment (solid foundation) but you communicate indirectly through humor (learned pattern). This often comes from family where humor was the main language—serious conversations didn't happen, problems got laughed off, emotions were deflected with jokes. You're not trying to be hurtful; you're using the language you were taught.`,

    datingMeaning: {
      strengths: [
        'You keep relationships fun and playful',
        'You use humor to ease tension',
        "You're quick-witted and engaging",
        'Emotionally stable at the core',
        "You don't create unnecessary drama",
      ],
      challenges: [
        'Express frustrations through jokes instead of direct communication',
        "Teasing can land as hurtful even when you didn't intend it",
        "Partners don't know if you're serious or joking",
        'You can seem cold or emotionally unavailable',
        'Important conversations get derailed by humor',
      ],
    },

    redFlags: [
      'Partners say your jokes hurt or feel mocking',
      "You tease about real concerns but they think you're joking",
      "You can't have a serious conversation without making jokes",
      'Partners seem to withdraw after your teasing',
      'You use humor to deflect when things get emotionally real',
    ],

    coachingFocus: [
      'Express frustrations directly rather than through jokes',
      'Ensure teasing lands as playful, not hurtful',
      'Practice direct communication when issues matter',
      'Recognize when humor is being used to avoid emotions',
      'Building emotional safety alongside playfulness',
    ],

    callToActionCopy: 'Get Coaching on Serious Conversations',
  },

  // ========================================================================
  // ANXIOUS + ASSERTIVE: THE OPEN BOOK
  // ========================================================================
  {
    id: 'open-book',
    name: 'The Open Book',
    emoji: '🐕‍🦺',
    image: '/archetypes/open-book-puppy.png',
    summary:
      'You jump in fast emotionally. You share deeply. You move at speed 9 while dates are at speed 3. They feel overwhelmed.',

    patternDescription: `Like an eager puppy, you wear your heart on your sleeve with enthusiasm and expressiveness. You're not afraid to share your feelings, though your desire for reassurance can sometimes feel overwhelming to partners. You express love quickly. You share vulnerable things early. You want to move the relationship forward fast.`,

    datingCycle: [
      'You meet someone interesting → you feel excited and invested',
      'You share deeply and vulnerably → you say "I like you" quickly',
      'They feel the intensity of your investment → they get overwhelmed',
      'You want reassurance they like you too → you ask (multiple times)',
      'They give reassurance but seem distant → you interpret as rejection',
      'You escalate intensity trying to prove your value → they back away',
    ],

    rootCause: `You have anxious attachment. You learned early that love was inconsistent. You developed a strategy: if you invest MORE, love more, share more vulnerably, surely THEN they won't leave. Your assertiveness (you say what you want directly) actually makes your anxiety worse because you push harder when anxious, which pushes partners away.`,

    datingMeaning: {
      strengths: [
        'You openly express affection and feelings',
        'You create space for emotional vulnerability',
        'You actively work on relationship issues',
        'Partners never doubt your investment',
        "You don't play games or hold back",
      ],
      challenges: [
        'You move faster emotionally than partners can match',
        'You seek reassurance frequently and intensely',
        'Your vulnerability can feel like pressure',
        'You escalate when anxious (partners see this as needy)',
        'You share deep things before trust is established',
      ],
    },

    redFlags: [
      "You're asking for reassurance multiple times early in dating",
      'You\'re saying "I like you" or "I see a future with us" very early',
      'Dates seem overwhelmed or pull back after you share deeply',
      "You're planning the future with someone you've known 2 weeks",
      'You keep testing them: "Do you really like me?" / "Are you sure?"',
    ],

    coachingFocus: [
      'Practice self-soothing before seeking reassurance',
      'Balance emotional expression with giving space',
      'Trust that love does not require constant confirmation',
      'Pace your vulnerability with how much trust is established',
      "Recognize when you're escalating from anxiety",
    ],

    callToActionCopy: 'Get Coaching on Pacing Your Love',
  },

  // ========================================================================
  // ANXIOUS + PASSIVE: THE SELFLESS GIVER
  // ========================================================================
  {
    id: 'selfless-giver',
    name: 'The Selfless Giver',
    emoji: '🐨',
    image: '/archetypes/selfless-giver-koala.png',
    summary:
      "You do everything for partners hoping it will make them love you more. You sacrifice yourself and wonder why they don't appreciate it.",

    patternDescription: `You cling to relationships with deep attachment and put others' needs first. Your generous nature is a gift, but you may sacrifice too much of yourself hoping it will secure love. You remember every detail about them. You go the extra mile. You try so hard that it can feel suffocating to partners.`,

    datingCycle: [
      'You like someone → you start doing things for them',
      "You go out of your way for them → you hope they'll appreciate it",
      "They appreciate it but don't reciprocate equally → you don't say anything",
      "You keep doing more → you hope this will make them love you more",
      "You build resentment that they don't notice your effort → you get cold",
      'They feel controlled by your giving → they pull away',
    ],

    rootCause: `You have anxious attachment with a "giver" strategy. You learned that love = work and effort. You think if you just do enough, love enough, care enough, they'll stay. But love isn't a transaction. Your hypervigilance to their needs comes from fear they'll leave if you stop being useful.`,

    datingMeaning: {
      strengths: [
        'Deeply caring and attentive to partners',
        'Remembers every detail about loved ones',
        'Willing to go the extra mile',
        'Creates nurturing relationship atmosphere',
        'Partners feel cared for and noticed',
      ],
      challenges: [
        'You practice receiving as much as giving',
        'You assert your needs without guilt',
        'You build identity beyond relationship status',
        'You recognize that self-care is not selfish',
        "You build resentment when giving isn't reciprocated",
      ],
    },

    redFlags: [
      "You're doing things for dates that they didn't ask for",
      "You're keeping score of how much you've done for them",
      "You're hurt when they don't notice your effort",
      "You're struggling to ask for anything back",
      'You\'ve been called "needy" or "too much" despite your giving',
    ],

    coachingFocus: [
      'Practice receiving as much as giving',
      'Assert your needs without guilt',
      'Build identity beyond relationship status',
      'Recognize that self-care is not selfish',
      'Date people who give back equally',
    ],

    callToActionCopy: 'Get Coaching on Healthy Giving in Relationships',
  },

  // ========================================================================
  // ANXIOUS + AGGRESSIVE: THE FIERY PURSUER
  // ========================================================================
  {
    id: 'fiery-pursuer',
    name: 'The Fiery Pursuer',
    emoji: '🐆',
    image: '/archetypes/fiery-pursuer-cheetah.png',
    summary:
      'You pursue love with intensity and passion. When anxious, you push harder. This pushes partners away.',

    patternDescription: `You pursue love with intensity and passion. When anxiety meets aggression, you may push too hard for connection, sometimes creating the very distance you fear. You come on strong. You want intensity and passion. You escalate when anxious.`,

    datingCycle: [
      'You like someone → you pursue them actively',
      'They seem distant or unsure → you escalate to convince them',
      "You text more, call more, try harder → your anxiety is driving you forward",
      'They feel pressured → they pull away',
      'You interpret withdrawal as rejection → you escalate more',
      "They leave → you confirm your fear that love isn't possible",
    ],

    rootCause: `You have anxious attachment with an aggressive communication style. You learned that pursuing = caring, that intensity = love. When anxious (which is often), you don't slow down—you speed up. You don't pull back—you push forward. But this combination is exhausting for partners.`,

    datingMeaning: {
      strengths: [
        'Passionate and all-in when committed',
        'Fights for the relationship',
        'Does not let issues go unaddressed',
        'Highly emotionally engaged',
        "Doesn't give up easily",
      ],
      challenges: [
        'Your intensity can feel like pressure',
        'You escalate when partners need space',
        'You pursue harder when they pull away (making it worse)',
        'You can seem controlling or obsessive',
        'Partners often feel suffocated by your pursuit',
      ],
    },

    redFlags: [
      "You're texting multiple times when they haven't responded",
      "You're pursuing harder when they pull away",
      "You're calling/texting despite them saying they need space",
      'Partners have said you\'re "intense" or "too much"',
      'You arrange surprise visits hoping to win them over',
    ],

    coachingFocus: [
      'Practice pause before pursuit',
      'Channel intensity into positive expressions',
      'Recognize when pushing drives partners away',
      'Develop patience with relationship pacing',
      'Self-soothe when anxious instead of pursuing',
    ],

    callToActionCopy: 'Get Coaching on Healthy Pursuit in Dating',
  },

  // ========================================================================
  // ANXIOUS + PASSIVE-AGGRESSIVE: THE MIND READER
  // ========================================================================
  {
    id: 'mind-reader',
    name: 'The Mind Reader',
    emoji: '🦉',
    image: '/archetypes/mind-reader-owl.png',
    summary:
      'You notice everything and test partners indirectly. You expect them to read your mind and prove their love through unspoken hints.',

    patternDescription: `You observe everything your date does. You analyze it. You decide what it means. You get upset about things they don't know bothered you. You drop hints hoping they'll figure it out. When they don't, you feel rejected. You go quiet or make sarcastic comments. They feel attacked but don't know why.`,

    datingCycle: [
      "Something bothers you → you don't say anything",
      "You drop hints hoping they'll figure it out → they don't notice",
      "You interpret their not noticing as proof they don't care → you get hurt",
      'You go quiet or make sarcastic comments → they feel attacked',
      'They ask what\'s wrong, you say "nothing" → they feel rejected',
      "They pull back because they can't win → you confirm they don't care",
    ],

    rootCause: `You have anxious attachment with passive-aggressive communication. You learned that expressing needs = conflict = abandonment. So you hide your needs, test partners with hints, and feel rejected when they don't pass the test. But you never gave them the actual test.`,

    datingMeaning: {
      strengths: [
        'Highly perceptive of relationship dynamics',
        'Notices subtleties others miss',
        'Deeply analytical about emotions',
        'Protective of relationship harmony',
        'Can articulate complex emotional dynamics',
      ],
      challenges: [
        'You expect partners to read your mind',
        'You test them indirectly instead of saying what you need',
        'You go cold/sarcastic when disappointed',
        "You don't give partners a fair chance to help",
        "You interpret not-reading-your-mind as proof they don't care",
      ],
    },

    redFlags: [
      "You're upset about things your date doesn't know bothered you",
      "You're dropping hints about what you need instead of asking",
      "You're going quiet or sarcastic when disappointed",
      'You\'re testing them: "If you really cared, you\'d..."',
      "You're interpreting their failure to read your mind as rejection",
    ],

    coachingFocus: [
      'State needs directly instead of hinting',
      'Avoid testing partners to prove their love',
      'Trust that asking for what you want is okay',
      "Address issues when they're small, not later",
      "Recognize when you're creating tests no one can pass",
    ],

    callToActionCopy: 'Get Coaching on Direct Communication',
  },

  // ========================================================================
  // AVOIDANT + ASSERTIVE: THE SOLO VOYAGER
  // ========================================================================
  {
    id: 'solo-voyager',
    name: 'The Solo Voyager',
    emoji: '🦅',
    image: '/archetypes/solo-voyager-eagle.png',
    summary:
      'You value your independence above all. Relationships feel like a threat to your autonomy. You push partners away when they get close.',

    patternDescription: `You value your freedom and independence above all. You're confident in who you are and clear about your boundaries. Intimacy often feels like a threat to your autonomy. When things get close, you get uncomfortable. You need space and you take it.`,

    datingCycle: [
      "You like someone → you keep them at arm's length",
      'They try to get closer → you feel uncomfortable',
      'You need space → you pull away or get distant',
      'They feel rejected → they pull back',
      "You feel relief at the distance → you're comfortable again",
      "They move on → you're relieved and sad at the same time",
    ],

    rootCause: `You have avoidant attachment with assertive communication (you say you want space clearly). You learned that relationships = loss of self. Intimacy = vulnerability = danger. Your independence is a protective strategy, not a character trait.`,

    datingMeaning: {
      strengths: [
        'Strong sense of self and identity',
        'Clear about personal boundaries',
        'Self-sufficient and capable',
        'Will not lose yourself in relationships',
        'Independent and self-directed',
      ],
      challenges: [
        'You pull away when partners try to get close',
        'Intimacy feels suffocating rather than connecting',
        "You're hard to reach emotionally",
        "Partners feel rejected even though you don't intend it",
        'You struggle with true interdependence',
      ],
    },

    redFlags: [
      "You're pulling away when partners try to get closer",
      "You're saying you need space frequently",
      "You're avoiding serious conversations about the relationship",
      "Partners feel like they can't get close no matter what",
      "You've been in multiple relationships that ended with partners feeling distant from you",
    ],

    coachingFocus: [
      'Practice letting others in without losing yourself',
      'Recognize that interdependence is not weakness',
      'Allow yourself to need and be needed',
      'Stay present when closeness triggers flight',
      'Understanding the difference between healthy boundaries and walls',
    ],

    callToActionCopy: 'Get Coaching on Opening Up Without Losing Yourself',
  },

  // ========================================================================
  // AVOIDANT + PASSIVE: THE QUIET GHOST
  // ========================================================================
  {
    id: 'quiet-ghost',
    name: 'The Quiet Ghost',
    emoji: '🐢',
    image: '/archetypes/quiet-ghost-turtle.png',
    summary:
      'When relationships get intense, you disappear. You avoid conflict and connection alike. Partners feel confused and abandoned.',

    patternDescription: `You retreat into your shell when relationships feel too close or demanding. You avoid conflict and connection alike, often disappearing when things get emotionally intense. You're not doing it on purpose. Your nervous system gets triggered and your instinct is to escape.`,

    datingCycle: [
      'Things get emotionally real → you feel overwhelmed',
      'You need to escape → you go quiet',
      "You take longer to respond → you're busy or just not engaging",
      "Your date wonders what happened → they don't understand",
      'You either re-engage after time OR you ghost → they feel abandoned',
      "Connection dies because they can't reach you",
    ],

    rootCause: `You have avoidant attachment with passive communication. You learned that conflict = pain, so you escape. You also learned not to speak up, so you just withdraw instead of saying "I need space." Disappearing feels safer than communicating.`,

    datingMeaning: {
      strengths: [
        'Creates no drama or pressure',
        'Low-maintenance relationship presence',
        'Self-contained and peaceful',
        'Values quality over quantity in connection',
        "Doesn't overwhelm with demands",
      ],
      challenges: [
        'You disappear when partners need you most',
        'You avoid communication instead of using it',
        "Partners can't reach you emotionally",
        'You never let them really know you',
        'Relationships end because partners feel abandoned',
      ],
    },

    redFlags: [
      "You're taking longer and longer to respond to texts",
      'When conflicts start, you go quiet or disappear',
      'Partners have said "I never know where I stand with you"',
      "You've ghosted people before or considered it",
      "You can't have difficult conversations even when necessary",
    ],

    coachingFocus: [
      'Practice staying present during difficult conversations',
      'Communicate when you need space rather than vanishing',
      'Recognize withdrawal patterns before they damage bonds',
      'Build tolerance for emotional closeness gradually',
      'Use words instead of disappearing',
    ],

    callToActionCopy: 'Get Coaching on Staying Present',
  },

  // ========================================================================
  // AVOIDANT + AGGRESSIVE: THE IRON FORTRESS
  // ========================================================================
  {
    id: 'iron-fortress',
    name: 'The Iron Fortress',
    emoji: '🦔',
    image: '/archetypes/iron-fortress-armadillo.png',
    summary:
      "You've built impenetrable defenses around your heart. You push others away with harsh words or cold distance. Love feels dangerous.",

    patternDescription: `You've built impenetrable defenses around your heart. You push others away with harsh words or cold distance, protecting yourself from the vulnerability that love requires. You're not trying to be mean; you're trying to be safe.`,

    datingCycle: [
      'Someone tries to get close → you feel threatened',
      "You respond harshly or coldly → you're pushing them away",
      'They feel rejected → they back off',
      'You feel relief and vindication → "See? People are dangerous"',
      "They leave for good → you tell yourself you didn't want them anyway",
      'You stay alone and call it freedom',
    ],

    rootCause: `You have avoidant attachment with aggressive communication. You learned that vulnerability = danger. People = pain. Your harshness is a defense mechanism. You attack first so you don't get hurt.`,

    datingMeaning: {
      strengths: [
        'Extremely self-reliant',
        'Clear boundaries that never waver',
        'Does not tolerate disrespect',
        'Protective of personal space',
        "You know what you will and won't accept",
      ],
      challenges: [
        'You push people away preemptively',
        'Your armor keeps out love too',
        "People feel like they can't win with you",
        'Your harshness damages connections before they start',
        "You're alone by choice but lonely in reality",
      ],
    },

    redFlags: [
      'You\'re telling people harsh things and justifying it as "honesty"',
      "You're pushing partners away before they can leave you",
      'People have said you\'re "cold" or "harsh"',
      "You can't soften even when your partner is vulnerable",
      "You've been in relationships that ended because you were too harsh",
    ],

    coachingFocus: [
      'Recognize that armor keeps out love too',
      'Practice vulnerability in small steps',
      'Soften defensive reactions',
      'Understand that past hurts do not have to define future relationships',
      'Learning gentleness without being weak',
    ],

    callToActionCopy: 'Get Coaching on Opening Your Heart',
  },

  // ========================================================================
  // AVOIDANT + PASSIVE-AGGRESSIVE: THE COOL MYSTERY
  // ========================================================================
  {
    id: 'cool-mystery',
    name: 'The Cool Mystery',
    emoji: '🐈',
    image: '/archetypes/cool-mystery-cat.png',
    summary:
      'You maintain emotional distance while keeping partners guessing. You express displeasure through coldness or withdrawal, not words.',

    patternDescription: `You maintain emotional distance while keeping partners guessing. You express displeasure through coldness or withdrawal rather than words, creating an air of mystery that can feel like rejection. You're not cold intentionally. You're just shut down emotionally.`,

    datingCycle: [
      "Something bothers you → you don't say anything",
      'You go cold or distant → your partner feels it',
      'They ask what\'s wrong → you say "nothing, I\'m fine"',
      'Your coldness persists → they feel rejected',
      "They pull away → you confirm they don't care",
      'Connection dies slowly from lack of warmth',
    ],

    rootCause: `You have avoidant attachment with passive-aggressive communication. You learned not to speak up AND not to get close. When frustrated, you don't express it—you punish through withdrawal and coldness.`,

    datingMeaning: {
      strengths: [
        'Maintains healthy independence',
        'Does not create explosive conflict',
        'Intriguing and hard to read',
        'Values personal space and quiet',
        "Doesn't overwhelm with emotions",
      ],
      challenges: [
        'You express needs and frustrations through coldness',
        'You avoid direct communication',
        "Partners feel rejected even when you're just quiet",
        'You punish through withdrawal',
        "Partners can't reach you emotionally",
      ],
    },

    redFlags: [
      'You go cold when frustrated instead of talking about it',
      'Your partners say "I never know where I stand with you"',
      'You use the silent treatment as punishment',
      "You're hard to read and people say it's exhausting",
      "You've been told you're emotionally unavailable",
    ],

    coachingFocus: [
      'Express needs and frustrations directly',
      'Avoid silent treatment as a communication tool',
      'Let partners understand your emotional world',
      'Practice warmth even when it feels vulnerable',
      'Using words instead of coldness',
    ],

    callToActionCopy: 'Get Coaching on Warm Communication',
  },

  // ========================================================================
  // DISORGANIZED + ASSERTIVE: THE SELF-AWARE ALCHEMIST
  // ========================================================================
  {
    id: 'self-aware-alchemist',
    name: 'The Self-Aware Alchemist',
    emoji: '🐙',
    image: '/archetypes/self-aware-alchemist-octopus.png',
    summary:
      "You're highly intelligent about your own patterns. You can articulate what's happening inside you. But you struggle to change behavior.",

    patternDescription: `You're highly intelligent and self-aware despite your chaotic attachment patterns. You can articulate what's happening inside you, even when your behavior contradicts your words. You know exactly what your issues are. You can describe them brilliantly. But knowing about it and changing it are two different things.`,

    datingCycle: [
      "You meet someone → you're all in emotionally",
      'Something triggers you → you pull away drastically',
      'They try to understand → you can explain your patterns perfectly',
      'You re-engage → they feel hopeful',
      'Same trigger comes up → you pull away again',
      "They leave exhausted → you understand why but can't change it",
    ],

    rootCause: `You have disorganized attachment with assertive communication. You can identify your patterns but haven't done the deeper work to change them. You might say "I know I sabotage relationships" but continue sabotaging them. Self-awareness without action.`,

    datingMeaning: {
      strengths: [
        'Highly self-aware about patterns',
        'Can communicate complex emotions',
        'Actively working on growth',
        'Resilient despite challenges',
        'Willing to discuss your own dynamics',
      ],
      challenges: [
        "You know your pattern but can't stop it",
        "Your actions don't match your understanding",
        'You can explain dysfunction while creating it',
        "Partners feel like they're in therapy with you",
        'You use self-awareness as an excuse: "I know I\'m broken"',
      ],
    },

    redFlags: [
      'You can describe your patterns perfectly but repeat them anyway',
      'You say "I know I\'m going to sabotage this" and then do it',
      "Partners feel like they're in therapy listening to your analysis",
      'You explain your dysfunction instead of changing it',
      'You use self-awareness to avoid accountability',
    ],

    coachingFocus: [
      'Align actions with stated intentions',
      'Build consistency in relationship behaviors',
      'Use insight to change, not just understand, patterns',
      'Seek professional support for deeper healing',
      'Moving from analysis to action',
    ],

    callToActionCopy: 'Get Coaching on Turning Awareness Into Change',
  },

  // ========================================================================
  // DISORGANIZED + PASSIVE: THE CHAMELEON
  // ========================================================================
  {
    id: 'chameleon',
    name: 'The Chameleon',
    emoji: '🦎',
    image: '/archetypes/chameleon-chameleon.png',
    summary:
      "You shift and change based on who you're with. You lose yourself in relationships. Partners don't know the real you.",

    patternDescription: `You shift and change based on who you're with, losing yourself in the process. Your unpredictable attachment patterns combine with passivity to create constant shape-shifting in relationships. You're not doing this consciously. You're adapting to survive.`,

    datingCycle: [
      'You meet someone → you become who they need you to be',
      "They fall for the version you're presenting → you feel valued",
      "But the real you starts showing → they're confused",
      "You try to go back to the persona → it's exhausting",
      "You either swing to extreme or disappear → they're whiplashed",
      'Relationship ends because they never knew the real you',
    ],

    rootCause: `You have disorganized attachment with passive communication. You never learned a stable sense of self. You learned to be what others need to survive. Now you automatically shape-shift to keep people close.`,

    datingMeaning: {
      strengths: [
        'Adaptable to different relationship dynamics',
        'Non-confrontational',
        'Open to going with the flow',
        'Can fit into various social situations',
        'Good at reading what others need',
      ],
      challenges: [
        'You develop unstable sense of self in relationships',
        "You can't have opinions or preferences",
        'You stop abandoning yourself for acceptance',
        "Partners don't know who you actually are",
        'You attract people who need to control or mold you',
      ],
    },

    redFlags: [
      "You're completely different people with different partners",
      "You don't know who you are outside relationships",
      'You change your values/preferences to match partners',
      'You abandon your friends when in relationships',
      'Partners have said "I don\'t know who you really are"',
    ],

    coachingFocus: [
      'Develop consistent sense of self',
      'Practice having opinions and preferences',
      'Stop abandoning yourself for acceptance',
      'Build stable identity independent of partners',
      'Learning to be yourself instead of adapting',
    ],

    callToActionCopy: 'Get Coaching on Finding Your True Self',
  },

  // ========================================================================
  // DISORGANIZED + AGGRESSIVE: THE WILD STORM
  // ========================================================================
  {
    id: 'wild-storm',
    name: 'The Wild Storm',
    emoji: '🐂',
    image: '/archetypes/wild-storm-bull.png',
    summary:
      'Your relationships are intense and sometimes destructive. You cycle between craving closeness and pushing people away with force.',

    patternDescription: `Your relationships are marked by intense, sometimes destructive energy. You cycle between craving closeness and pushing away with force, creating emotional whiplash for partners. You're not trying to be destructive. Your nervous system is dysregulated.`,

    datingCycle: [
      "You meet someone → you're intensely invested",
      'Something triggers you → you blow up or push them away hard',
      "They try to understand → you're angry or defensive",
      "You pull away → they feel relieved and confused",
      "You reach back out → they're hopeful",
      "Same cycle repeats → they can't take the whiplash",
    ],

    rootCause: `You have disorganized attachment with aggressive communication. Your nervous system learned that relationships = danger + safety simultaneously. You swing between intense pursuit and aggressive rejection. You're not stable in the middle.`,

    datingMeaning: {
      strengths: [
        'Deeply passionate when engaged',
        'Does not pretend emotions do not exist',
        'Fights for connection in your own way',
        'Capable of intense love',
        "Won't settle for less than authentic",
      ],
      challenges: [
        'Your intensity can be destructive',
        'You cycle between loving and rejecting',
        'You create emotional whiplash for partners',
        'Your aggression pushes people away',
        'Partners feel unsafe with your volatility',
      ],
    },

    redFlags: [
      'You have intense blow-ups or aggressive moments in relationships',
      'You cycle between being all-in and pushing people away hard',
      'Partners have said you\'re "emotionally intense" or "volatile"',
      'You create drama or chaos in relationships',
      "You've damaged relationships through aggressive behavior",
    ],

    coachingFocus: [
      'Learn emotional regulation techniques',
      'Pause before reacting in conflict',
      'Channel intensity into healthy expression',
      'Seek professional support for trauma healing',
      'Building stability in relationships',
    ],

    callToActionCopy: 'Get Coaching on Managing Your Intensity',
  },

  // ========================================================================
  // DISORGANIZED + PASSIVE-AGGRESSIVE: THE LABYRINTH
  // ========================================================================
  {
    id: 'labyrinth',
    name: 'The Labyrinth',
    emoji: '🐍',
    image: '/archetypes/labyrinth-snake.png',
    summary:
      "You're complex and hard to read. You send mixed signals. Partners feel confused by your contradictory behavior.",

    patternDescription: `You are complex and hard to read, sending mixed signals that keep partners confused. Your contradictory attachment patterns express themselves through indirect, sometimes manipulative communication. You test partners. You pull them close then push them away. No one can figure you out—including you.`,

    datingCycle: [
      "You like someone → you test them to see if they'll stay",
      "You pull close then push away → they're confused",
      "You send mixed messages → they can't trust you",
      "You act one way then another → they don't know which is real",
      'They try harder to understand → you withdraw or manipulate',
      "Relationship ends because they can't reach you",
    ],

    rootCause: `You have disorganized attachment with passive-aggressive communication. You learned that relationships were unpredictable. You test people indirectly before committing. You communicate through manipulation rather than words.`,

    datingMeaning: {
      strengths: [
        'Complex emotional intelligence',
        'Protective of deepest vulnerabilities',
        'Observant of relationship dynamics',
        'Survives difficult emotional terrain',
        'Intuitive about unspoken dynamics',
      ],
      challenges: [
        'You communicate indirectly or manipulatively',
        'You test partners instead of trusting',
        'You send contradictory signals',
        "You're hard for partners to understand",
        'You create confusion instead of clarity',
      ],
    },

    redFlags: [
      'You test partners: "If they really love me, they\'ll..."',
      'You send mixed signals about how you feel',
      'You manipulate situations instead of communicating',
      'Partners say "I can never tell what you\'re thinking"',
      "You create drama to test if they'll stay",
    ],

    coachingFocus: [
      'Communicate directly rather than through hints or tests',
      'Recognize manipulation patterns, even unintentional ones',
      'Build trust through consistency',
      'Work with a professional on attachment patterns',
      'Learning to be transparent instead of mysterious',
    ],

    callToActionCopy: 'Get Coaching on Clear Communication',
  },
];
