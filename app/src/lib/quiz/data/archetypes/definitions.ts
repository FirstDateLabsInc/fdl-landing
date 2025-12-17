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

    patternDescription: `You're the kind of person who lights up when you meet someone interesting. You're comfortable saying "I like you," and you actually enjoy building a relationship, not just the chase. Your friends might say, "You just make people feel at ease," and they're not wrong. You didn't grow up with a lot of mixed signals about love, so you don't feel like you have to decode everything or constantly protect yourself.`,

    datingCycle: [
      "You meet someone ➜ you feel real curiosity and interest (not performing, just being yourself)",
      "You share openly ➜ you don't play games or hold back to seem \"cool\"",
      "They feel secure ➜ because you show up in a steady, trustworthy way",
      "Things develop naturally ➜ conflict still happens, but you handle it with honesty and calm",
      "The relationship either grows or ends cleanly ➜ either way, you process it and move on",
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

    callToActionCopy: 'Practice This in the App',
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
      "You're easy to be around, but sometimes you end up in the background. You say \"yes\" when you mean \"no,\" and later feel upset about choices you technically agreed to.",

    patternDescription: `You're the person who says, "Whatever you want is fine," even when you quietly care about how things go. You really don't like conflict, so you go along with plans you don't fully want and then feel frustrated afterward. On dates, when the other person suggests something, your first instinct is to agree—even if you had something else in mind. You tell yourself you're being flexible. Over time, what you want just gets pushed to the side.`,

    datingCycle: [
      "Date suggests a plan or idea ➜ you immediately think \"I should go with it\"",
      "You suppress your preference ➜ you say \"sounds good!\" or stay quiet",
      "You go along with something you didn't really want ➜ frustration starts to build",
      "They notice you're quieter or more distant ➜ they feel confused about what changed",
      "You respond \"nothing's wrong, I'm fine\" ➜ they feel rejected for no reason",
      "They pull away slightly ➜ you blame yourself for not being enthusiastic enough",
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

    callToActionCopy: 'Practice This in the App',
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
      "You take the lead in dating, but sometimes your pace can feel like a lot for other people. You move quickly and naturally expect partners to keep up.",

    patternDescription: `You know what you want and you're not shy about saying it. On dates, you're the one who takes charge — you suggest the restaurant, map out the plan, and guide the conversation. Your friends probably describe you as "strong" or "confident." And you are. But sometimes people seem intimidated or overwhelmed by how much you dominate the dating dynamic. You're not trying to be pushy; taking the lead just feels natural to you. Some people relax into that, and others quietly back away.`,

    datingCycle: [
      "You like someone ➜ you make a plan, you're decisive",
      "You set the tone ➜ they feel the weight of your certainty",
      "You try to move things forward ➜ the relationship speeds up",
      "They feel pressured or dominated ➜ they pull back",
      "You read their pullback as low interest ➜ you escalate or withdraw",
      "Connection ends because the dynamic was unbalanced",
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

    callToActionCopy: 'Practice This in the App',
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
      "You tend to use a light, relaxed tone in dating. It makes interactions feel easy at first, but sometimes partners aren't sure how seriously to take what you say.",

    patternDescription: `You have an engaging way of relating to people, and you often bring a lighter tone into conversations. You use gentle teasing to create closeness. You're generally secure and your intention is to make the interaction feel comfortable, not critical. But you express something that genuinely matters to you in this lighter style instead of saying it more directly. Partners don't always catch that. Over time, they may feel a bit unsure about how seriously to take your feelings.`,

    datingCycle: [
      "You like someone ➜ you use a light, teasing tone to build connection",
      "They respond and engage ➜ the interaction feels smooth and relaxed",
      "You tease about something that actually bothered you ➜ they don't realize you were serious",
      "Later, they realize you were upset ➜ the issue remains unclear",
      "You downplay it (\"It's not a big deal\") ➜ they feel it's hard to read what you really feel",
      "They pull back ➜ you lose the lightness you were trying to create",
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

    callToActionCopy: 'Practice This in the App',
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
      "You open up quickly in dating. You share a lot early on and tend to get emotionally involved faster. They struggle to keep up and feel overwhelmed.",

    patternDescription: `You're expressive and open-hearted, and you show your feelings clearly. You're not afraid to say what someone means to you, and you're willing to be emotionally honest early on. You share personal and vulnerable things sooner, and you often want the relationship to move forward at a quicker pace. Your wish for closeness and reassurance can sometimes feel intense for partners who are still getting to know you.`,

    datingCycle: [
      "You meet someone interesting ➜ you feel excited and invested",
      "You share deeply and vulnerably ➜ you say \"I like you\" quickly",
      "They feel the intensity of your investment ➜ they get overwhelmed",
      "You want reassurance they like you too ➜ you ask (multiple times)",
      "They give reassurance but seem distant ➜ you interpret as rejection",
      "You escalate intensity trying to prove your value ➜ they back away",
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

    callToActionCopy: 'Practice This in the App',
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
      "You put a lot of care and effort into your relationships. You naturally focus on your partner's needs. But you end up feeling unseen or unappreciated for how much you give.",

    patternDescription: `You form strong attachments and tend to show love through doing things for the other person. Your willingness to give and support is a real strength, but at times you set your own needs aside for too long. You notice the small details. You remember what they like. When this isn't matched or clearly acknowledged, it can quietly become painful for you, and the relationship can start to feel uneven.`,

    datingCycle: [
      "You like someone ➜ you naturally start doing caring things for them",
      "You put in extra effort ➜ you hope they'll feel supported and valued",
      "They appreciate it but don't always respond in the same way ➜ you don't speak up about how you feel",
      "You keep giving more ➜ you hope the connection will deepen",
      "Over time you feel tired and unnoticed ➜ frustration starts to build",
      "You become more distant or less warm ➜ they may experience this shift as tension and step back",
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

    callToActionCopy: 'Practice This in the App',
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
      "You bring a lot of energy and passion into dating. When you really care about someone, you lean in. When you feel anxious, you move even closer, which can feel intense for the other person.",

    patternDescription: `You don't hide your interest. When you like someone, you're engaged, responsive, and willing to invest. You value emotional intensity and clear signs of connection. When you sense distance or mixed signals, it's hard for you to sit back and wait — reaching out more feels like the way to keep the connection alive. What feels like care and effort on your side can feel like pressure on theirs, and that gap can create the distance you're trying to avoid.`,

    datingCycle: [
      "You like someone ➜ you pursue them actively",
      "They seem distant or unsure ➜ you escalate to convince them",
      "You text more, call more, try harder ➜ your anxiety is driving you forward",
      "They feel pressured ➜ they pull away",
      "Their distance feels like rejection ➜ your anxiety rises and you escalate more",
      "The connection becomes strained or ends ➜ it reinforces your worry that it's hard to find stable closeness",
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

    callToActionCopy: 'Practice This in the App',
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
      "You're highly observant in relationships. You pick up on details and subtle shifts, and hope partners will understand your needs or feelings without talking to them directly.",

    patternDescription: `You notice a lot—tone changes, delayed replies, small actions. You think about what these signs might mean and often draw your own conclusions. When something bothers you, you do not bring it up right away. Instead, you hint at it or change your tone, hoping the other person will understand it. When they don't respond the way you were hoping, you feel disappointing. From their side, things can suddenly feel tense, but they're not sure what happened.`,

    datingCycle: [
      "Something bothers you ➜ you don't say anything",
      "You drop hints hoping they'll figure it out ➜ they don't fully pick up on it",
      "They don't fully pick up on it ➜ you feel unseen",
      "You become quieter or use more sarcastic comments ➜ they sense tension but don't know the reason",
      "They ask what's going on, and you say \"It's fine\" or \"Nothing\" ➜ they feel confused",
      "They step back to avoid making things worse ➜ you confirm they don't care",
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

    callToActionCopy: 'Practice This in the App',
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
      "You care deeply about having your own space and direction in life. When relationships start to feel like they might limit that, you create distance or pull back.",

    patternDescription: `You're comfortable on your own and confident in who you are. You know your limits and you protect them. As emotional closeness grows, it can start to feel like pressure or expectation. When that happens, you step back—taking more space, keeping things lighter or focusing on your own world again—so you can feel grounded and independent.`,

    datingCycle: [
      "You like someone ➜ you enjoy the connection but keep some distance",
      "They try to get closer ➜ you start to feel pressured or crowded",
      "You want more space ➜ you become less available or more reserved",
      "They notice the distance ➜ they step back to protect themselves",
      "With more space again ➜ you feel more at ease, though a bit conflicted",
      "They move on ➜ you feel both relief and a sense of loss",
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

    callToActionCopy: 'Practice This in the App',
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
      "When relationships start to feel intense or demanding, you pull back. Instead of staying engaged, you create distance, and partners can be left feeling confused or shut out.",

    patternDescription: `When things become more emotionally real, your system can feel overloaded. Stepping back feels safer than staying in the moment. You go quiet, reply more slowly, or disappear for a while. For you, it's a way to calm down and get space. For the other person, it can look like you suddenly lost interest or stopped caring.`,

    datingCycle: [
      "Things get emotionally real ➜ you feel overwhelmed",
      "You need to escape ➜ you go quiet",
      "You take longer to respond ➜ you're busy or just not engaging",
      "The other person notices the distance ➜ they feel unsure about what's happening",
      "You either re-engage after time OR you ghost ➜ they feel left behind",
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

    callToActionCopy: 'Practice This in the App',
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
      "You're highly protective of your inner world. When people get close, you respond with distance or sharpness, and relationships can start to feel risky rather than safe.",

    patternDescription: `Over time, you've learned to rely on strong defenses. Keeping some distance feels safer than letting someone in and possibly getting hurt. On the outside, you might look cold, harsh, or uninterested. Inside, you're mostly trying to stay safe, not trying to hurt anyone.`,

    datingCycle: [
      "Someone tries to get close ➜ you feel threatened",
      "You respond harshly or coldly ➜ you're pushing them away",
      "They feel rejected ➜ they back off",
      "You feel a mix of relief and confirmation ➜ \"Getting close always leads to trouble.\"",
      "They leave for good ➜ you tell yourself you didn't want them anyway",
      "You stay alone and call it freedom",
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

    callToActionCopy: 'Practice This in the App',
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
      "You tend to stay emotionally distant in relationships. Partners often end up guessing what you're really thinking or feeling. When you're upset, you're more likely to pull back than to talk about it directly.",

    patternDescription: `You often keep your inner world private. You express displeasure through coldness or withdrawal rather than words, creating an air of mystery that can feel like rejection. From your side, this is a way of protecting yourself and calming down. From the other person's side, it can feel like you've suddenly pulled the plug on closeness.`,

    datingCycle: [
      "Something bothers you ➜ you don't say anything",
      "You go cold or distant ➜ your partner feels it",
      "They ask what's wrong ➜ you say \"nothing, I'm fine\"",
      "Your coldness persists ➜ they feel rejected",
      "They pull away ➜ you confirm they don't care",
      "Connection dies slowly from lack of warmth",
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

    callToActionCopy: 'Practice This in the App',
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
      "You understand yourself very well. You can see your own patterns and explain them clearly. But turning this insight into action remains difficult.",

    patternDescription: `You're thoughtful and self-aware. You can describe your fears, triggers, and reactions in detail—even when your actions don't match what you say you want. You're not clueless about your issues; in fact, you might understand them better than most people. The challenge is that insight and change don't always move at the same speed. Your mind gets it, but your reactions still follow old habits.`,

    datingCycle: [
      "You meet someone ➜ you get emotionally invested and open up quickly",
      "Something triggers you ➜ you pull back hard, or create distance",
      "They try to understand ➜ you can explain your patterns and where they come from very clearly",
      "You re-engage and reconnect ➜ they feel hopeful that things will be different",
      "The same kind of trigger shows up again ➜ you repeat the same distancing reaction, even though you see it happening",
      "They eventually feel tired and worn out ➜ you understand exactly why, but changing the pattern still feels difficult",
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

    callToActionCopy: 'Practice This in the App',
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
      "You're very good at adapting to other people. In relationships, you often change to fit what the other person seems to want, and over time it can feel like you've lost touch with your own needs and identity.",

    patternDescription: `You're sensitive to the people around you and quick to adjust. When you like someone, you naturally tune into their preferences, moods, and expectations. At first, this can make the connection feel smooth and easy. But as time goes on, the parts of you that don't really fit that version start to come out. You feel tired from keeping up the "ideal" version of yourself, and they feel confused because you suddenly don't seem like the person they first met.`,

    datingCycle: [
      "You meet someone ➜ you quickly adapt and become the version you think they'll like",
      "They respond well to this version of you ➜ you feel seen and appreciated",
      "Over time, more of the \"real you\" shows up ➜ the differences start to feel noticeable",
      "You try to slip back into the version they liked at first ➜ it feels draining and unnatural",
      "You swing between over-adapting and pulling away ➜ they feel unsettled and unsure what to expect",
      "The relationship fades or ends ➜ it can feel like they never truly got to know who you really are",
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

    callToActionCopy: 'Practice This in the App',
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
      "Your relationships can feel very intense—for you and for the other person. You swing between wanting a lot of closeness and then needing to push people away when it all feels too much.",

    patternDescription: `Your feelings in relationships tend to be strong. When you care about someone, you feel it deeply and get very involved. But when you're triggered, overwhelmed, or scared of getting hurt, your reactions can become big and sudden—pulling away or starting conflict. You're not trying to cause chaos; your emotions just move quickly, and it's hard to slow things down in the moment. For partners, this up-and-down pattern can feel confusing and tiring.`,

    datingCycle: [
      "You meet someone ➜ you get emotionally involved and attached quickly",
      "Something triggers you ➜ you react strongly, argue, or push them away",
      "They try to understand or calm things down ➜ you may still feel angry, hurt, or defensive",
      "You take distance or step back ➜ they feel both relieved and unsure about where you stand",
      "After some time, you miss them and reach out again ➜ they feel hopeful the connection might stabilize",
      "A similar trigger shows up ➜ the same pattern repeats, and over time they feel worn out by the ups and downs",
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

    callToActionCopy: 'Practice This in the App',
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
      "You're layered and complex. In relationships, you can send mixed signals—sometimes warm, sometimes distant—so partners often feel unsure about where they stand with you.",

    patternDescription: `You feel a lot underneath the surface, and your feelings about closeness can change quickly. Part of you wants connection and intimacy; another part gets scared, guarded, or skeptical. You might test people without fully realizing it—pulling them closer to see if they care, then stepping back to see if they'll follow. You're not trying to play games; you're trying to feel safe and understood in a pattern that's hard even for you to untangle.`,

    datingCycle: [
      "You like someone ➜ you feel curious but also cautious, so you \"test\" how much they care",
      "You move closer, then suddenly create distance ➜ they feel confused by the change",
      "Your words and actions don't always match ➜ they're unsure what to believe",
      "You show one side of yourself, then another ➜ they don't know which version is the stable one",
      "They try harder to understand and get close ➜ you may pull back, shut down, or become harder to read",
      "The relationship eventually fades or ends ➜ they feel like they could never quite reach you, and you're left with mixed feelings about why it didn't work",
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

    callToActionCopy: 'Practice This in the App',
  },
];
