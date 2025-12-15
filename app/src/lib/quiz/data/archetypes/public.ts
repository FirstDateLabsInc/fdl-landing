/**
 * PUBLIC Archetype Data - CLIENT-SAFE
 *
 * This file contains ONLY the public portions of archetype data.
 * It is safe to include in the client bundle.
 *
 * LOCKED content (datingCycle, datingMeaning, redFlags, coachingFocus)
 * is stored in locked.server.ts and protected by `import 'server-only'`.
 */

import type { ArchetypePublic } from "./types";

export const archetypesPublic: ArchetypePublic[] = [
  // ========================================================================
  // SECURE + ASSERTIVE: THE GOLDEN PARTNER
  // ========================================================================
  {
    id: "golden-partner",
    name: "The Golden Partner",
    emoji: "🐕",
    image: "/archetypes/golden-partner-goldenRetriever.png",
    summary:
      "You genuinely enjoy dating and people can feel it. You say what you want, handle disagreement calmly, and make partners feel safe. This is rare.",
    patternDescription: `You're the kind of person who lights up when you meet someone interesting. You're comfortable saying "I like you," and you actually enjoy building a relationship, not just the chase. Your friends might say, "You just make people feel at ease," and they're not wrong. You didn't grow up with a lot of mixed signals about love, so you don't feel like you have to decode everything or constantly protect yourself.`,
    rootCause: `You have secure attachment at your core. You weren't sent mixed signals about love growing up, so you don't have to decode relationships or protect yourself defensively. This is genuinely rare and valuable. It means you date from a place of "this is nice" rather than "please don't leave me" or "I need to control this."`,
    callToActionCopy: "Get Coaching on Finding Your Match",
    datingCycleTeaser: [
      "You meet someone ➜ you feel real curiosity and interest (not performing, just being yourself)",
      "You share openly ➜ you don't play games or hold back to seem \"cool\"",
      "They feel secure ➜ because you show up in a steady, trustworthy way",
    ],
    datingCycleTotalCount: 5,
    redFlagsTeaser: [
      "You're adapting your communication style too much trying to make partners comfortable",
      "You're being \"the patient one\" so often it starts to feel like a role",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Recognizing when a partner's insecurity needs patience vs. when you should walk away",
      "Understanding different attachment styles so you stop being confused by anxious/avoidant behavior",
      "Dating people who are roughly as secure as you (so it's actually effortless)",
      "Avoiding the trap of being the \"strong one\" who rescues insecure partners",
      "Trusting your gut when something feels off, even if they seem nice",
    ],
  },

  // ========================================================================
  // SECURE + PASSIVE: THE GENTLE PEACEKEEPER
  // ========================================================================
  {
    id: "gentle-peacekeeper",
    name: "The Gentle Peacekeeper",
    emoji: "🕊️",
    image: "/archetypes/gentle-peacekeeper-dove.png",
    summary:
      "You're easy to be around, but sometimes you end up in the background. You say \"yes\" when you mean \"no,\" and later feel upset about choices you technically agreed to.",
    patternDescription: `You're the person who says, "Whatever you want is fine," even when you quietly care about how things go. You really don't like conflict, so you go along with plans you don't fully want and then feel frustrated afterward. On dates, when the other person suggests something, your first instinct is to agree—even if you had something else in mind. You tell yourself you're being flexible. Over time, what you want just gets pushed to the side.`,
    rootCause: `You have secure attachment (good base) but you communicate passively (learned pattern). This usually comes from childhood messaging like "be easy to be around" or "don't cause problems" or "your needs are less important than keeping the peace." You learned that speaking up = conflict, and conflict = danger/rejection.`,
    callToActionCopy: "Get Coaching on Finding Your Voice in Dating",
    datingCycleTeaser: [
      "Date suggests a plan or idea ➜ you immediately think \"I should go with it\"",
      "You suppress your preference ➜ you say \"sounds good!\" or stay quiet",
      "You go along with something you didn't really want ➜ frustration starts to build",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're agreeing to dates/plans you don't actually want",
      "You find yourself feeling clingy or needy after being agreeable (resentment building)",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Distinguishing between healthy compromise and self-abandonment",
      "Building confidence in having preferences and expressing them kindly",
      "Learning that saying \"I want X\" is not selfish or mean",
      "Recognizing partners who respect your preferences vs. those who take advantage",
      "Dating as yourself, not as a people-pleaser",
    ],
  },

  // ========================================================================
  // SECURE + AGGRESSIVE: THE DIRECT DIRECTOR
  // ========================================================================
  {
    id: "direct-director",
    name: "The Direct Director",
    emoji: "🦍",
    image: "/archetypes/direct-director-gorilla.png",
    summary:
      "You take the lead in dating, but sometimes your pace can feel like a lot for other people. You move quickly and naturally expect partners to keep up.",
    patternDescription: `You know what you want and you're not shy about saying it. On dates, you're the one who takes charge — you suggest the restaurant, map out the plan, and guide the conversation. Your friends probably describe you as "strong" or "confident." And you are. But sometimes people seem intimidated or overwhelmed by how much you dominate the dating dynamic. You're not trying to be pushy; taking the lead just feels natural to you. Some people relax into that, and others quietly back away.`,
    rootCause: `You have secure attachment (solid foundation) + aggressive communication style (learned that directness = respect, that hesitation = weakness). This often comes from family messaging like "be decisive," "winners don't ask permission," "hesitation is for losers." You learned that taking charge = respect. You're right in business. In dating, you're wrong.`,
    callToActionCopy: "Get Coaching on Collaborative Dating",
    datingCycleTeaser: [
      "You like someone ➜ you make a plan, you're decisive",
      "You set the tone ➜ they feel the weight of your certainty",
      "You try to move things forward ➜ the relationship speeds up",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "Your partners often say \"I feel like I don't have a choice\" about things",
      "You're dating people significantly weaker than you (easier to control)",
    ],
    redFlagsTotalCount: 6,
    coachingFocus: [
      "Learning the difference between leadership and domination",
      "Practicing letting partners have input and lead sometimes",
      "Softening your intensity without losing your confidence",
      "Recognizing when you're pushing vs. when you're flowing",
      "Finding partners who are secure enough to match your energy",
    ],
  },

  // ========================================================================
  // SECURE + PASSIVE-AGGRESSIVE: THE PLAYFUL TEASE
  // ========================================================================
  {
    id: "playful-tease",
    name: "The Playful Tease",
    emoji: "🦊",
    image: "/archetypes/playful-tease-fox.png",
    summary:
      "You tend to use a light, relaxed tone in dating. It makes interactions feel easy at first, but sometimes partners aren't sure how seriously to take what you say.",
    patternDescription: `You have an engaging way of relating to people, and you often bring a lighter tone into conversations. You use gentle teasing to create closeness. You're generally secure and your intention is to make the interaction feel comfortable, not critical. But you express something that genuinely matters to you in this lighter style instead of saying it more directly. Partners don't always catch that. Over time, they may feel a bit unsure about how seriously to take your feelings.`,
    rootCause: `You have secure attachment (solid foundation) but you communicate indirectly through humor (learned pattern). This often comes from family where humor was the main language—serious conversations didn't happen, problems got laughed off, emotions were deflected with jokes. You're not trying to be hurtful; you're using the language you were taught.`,
    callToActionCopy: "Get Coaching on Serious Conversations",
    datingCycleTeaser: [
      "You like someone ➜ you use a light, teasing tone to build connection",
      "They respond and engage ➜ the interaction feels smooth and relaxed",
      "You tease about something that actually bothered you ➜ they don't realize you were serious",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "Partners say your jokes hurt or feel mocking",
      "You tease about real concerns but they think you're joking",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Express frustrations directly rather than through jokes",
      "Ensure teasing lands as playful, not hurtful",
      "Practice direct communication when issues matter",
      "Recognize when humor is being used to avoid emotions",
      "Building emotional safety alongside playfulness",
    ],
  },

  // ========================================================================
  // ANXIOUS + ASSERTIVE: THE OPEN BOOK
  // ========================================================================
  {
    id: "open-book",
    name: "The Open Book",
    emoji: "🐕‍🦺",
    image: "/archetypes/open-book-puppy.png",
    summary:
      "You open up quickly in dating. You share a lot early on and tend to get emotionally involved faster. They struggle to keep up and feel overwhelmed.",
    patternDescription: `You're expressive and open-hearted, and you show your feelings clearly. You're not afraid to say what someone means to you, and you're willing to be emotionally honest early on. You share personal and vulnerable things sooner, and you often want the relationship to move forward at a quicker pace. Your wish for closeness and reassurance can sometimes feel intense for partners who are still getting to know you.`,
    rootCause: `You have anxious attachment. You learned early that love was inconsistent. You developed a strategy: if you invest MORE, love more, share more vulnerably, surely THEN they won't leave. Your assertiveness (you say what you want directly) actually makes your anxiety worse because you push harder when anxious, which pushes partners away.`,
    callToActionCopy: "Get Coaching on Pacing Your Love",
    datingCycleTeaser: [
      "You meet someone interesting ➜ you feel excited and invested",
      "You share deeply and vulnerably ➜ you say \"I like you\" quickly",
      "They feel the intensity of your investment ➜ they get overwhelmed",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're asking for reassurance multiple times early in dating",
      "You're saying \"I like you\" or \"I see a future with us\" very early",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Practice self-soothing before seeking reassurance",
      "Balance emotional expression with giving space",
      "Trust that love does not require constant confirmation",
      "Pace your vulnerability with how much trust is established",
      "Recognize when you're escalating from anxiety",
    ],
  },

  // ========================================================================
  // ANXIOUS + PASSIVE: THE SELFLESS GIVER
  // ========================================================================
  {
    id: "selfless-giver",
    name: "The Selfless Giver",
    emoji: "🐨",
    image: "/archetypes/selfless-giver-koala.png",
    summary:
      "You put a lot of care and effort into your relationships. You naturally focus on your partner's needs. But you end up feeling unseen or unappreciated for how much you give.",
    patternDescription: `You form strong attachments and tend to show love through doing things for the other person. Your willingness to give and support is a real strength, but at times you set your own needs aside for too long. You notice the small details. You remember what they like. When this isn't matched or clearly acknowledged, it can quietly become painful for you, and the relationship can start to feel uneven.`,
    rootCause: `You have anxious attachment with a "giver" strategy. You learned that love = work and effort. You think if you just do enough, love enough, care enough, they'll stay. But love isn't a transaction. Your hypervigilance to their needs comes from fear they'll leave if you stop being useful.`,
    callToActionCopy: "Get Coaching on Healthy Giving in Relationships",
    datingCycleTeaser: [
      "You like someone ➜ you naturally start doing caring things for them",
      "You put in extra effort ➜ you hope they'll feel supported and valued",
      "They appreciate it but don't always respond in the same way ➜ you don't speak up about how you feel",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're doing things for dates that they didn't ask for",
      "You're keeping score of how much you've done for them",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Practice receiving as much as giving",
      "Assert your needs without guilt",
      "Build identity beyond relationship status",
      "Recognize that self-care is not selfish",
      "Date people who give back equally",
    ],
  },

  // ========================================================================
  // ANXIOUS + AGGRESSIVE: THE FIERY PURSUER
  // ========================================================================
  {
    id: "fiery-pursuer",
    name: "The Fiery Pursuer",
    emoji: "🐆",
    image: "/archetypes/fiery-pursuer-cheetah.png",
    summary:
      "You bring a lot of energy and passion into dating. When you really care about someone, you lean in. When you feel anxious, you move even closer, which can feel intense for the other person.",
    patternDescription: `You don't hide your interest. When you like someone, you're engaged, responsive, and willing to invest. You value emotional intensity and clear signs of connection. When you sense distance or mixed signals, it's hard for you to sit back and wait — reaching out more feels like the way to keep the connection alive. What feels like care and effort on your side can feel like pressure on theirs, and that gap can create the distance you're trying to avoid.`,
    rootCause: `You have anxious attachment with an aggressive communication style. You learned that pursuing = caring, that intensity = love. When anxious (which is often), you don't slow down—you speed up. You don't pull back—you push forward. But this combination is exhausting for partners.`,
    callToActionCopy: "Get Coaching on Healthy Pursuit in Dating",
    datingCycleTeaser: [
      "You like someone ➜ you pursue them actively",
      "They seem distant or unsure ➜ you escalate to convince them",
      "You text more, call more, try harder ➜ your anxiety is driving you forward",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're texting multiple times when they haven't responded",
      "You're pursuing harder when they pull away",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Practice pause before pursuit",
      "Channel intensity into positive expressions",
      "Recognize when pushing drives partners away",
      "Develop patience with relationship pacing",
      "Self-soothe when anxious instead of pursuing",
    ],
  },

  // ========================================================================
  // ANXIOUS + PASSIVE-AGGRESSIVE: THE MIND READER
  // ========================================================================
  {
    id: "mind-reader",
    name: "The Mind Reader",
    emoji: "🦉",
    image: "/archetypes/mind-reader-owl.png",
    summary:
      "You're highly observant in relationships. You pick up on details and subtle shifts, and hope partners will understand your needs or feelings without talking to them directly.",
    patternDescription: `You notice a lot—tone changes, delayed replies, small actions. You think about what these signs might mean and often draw your own conclusions. When something bothers you, you do not bring it up right away. Instead, you hint at it or change your tone, hoping the other person will understand it. When they don't respond the way you were hoping, you feel disappointing. From their side, things can suddenly feel tense, but they're not sure what happened.`,
    rootCause: `You have anxious attachment with passive-aggressive communication. You learned that expressing needs = conflict = abandonment. So you hide your needs, test partners with hints, and feel rejected when they don't pass the test. But you never gave them the actual test.`,
    callToActionCopy: "Get Coaching on Direct Communication",
    datingCycleTeaser: [
      "Something bothers you ➜ you don't say anything",
      "You drop hints hoping they'll figure it out ➜ they don't fully pick up on it",
      "They don't fully pick up on it ➜ you feel unseen",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're upset about things your date doesn't know bothered you",
      "You're dropping hints about what you need instead of asking",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "State needs directly instead of hinting",
      "Avoid testing partners to prove their love",
      "Trust that asking for what you want is okay",
      "Address issues when they're small, not later",
      "Recognize when you're creating tests no one can pass",
    ],
  },

  // ========================================================================
  // AVOIDANT + ASSERTIVE: THE SOLO VOYAGER
  // ========================================================================
  {
    id: "solo-voyager",
    name: "The Solo Voyager",
    emoji: "🦅",
    image: "/archetypes/solo-voyager-eagle.png",
    summary:
      "You care deeply about having your own space and direction in life. When relationships start to feel like they might limit that, you create distance or pull back.",
    patternDescription: `You're comfortable on your own and confident in who you are. You know your limits and you protect them. As emotional closeness grows, it can start to feel like pressure or expectation. When that happens, you step back—taking more space, keeping things lighter or focusing on your own world again—so you can feel grounded and independent.`,
    rootCause: `You have avoidant attachment with assertive communication (you say you want space clearly). You learned that relationships = loss of self. Intimacy = vulnerability = danger. Your independence is a protective strategy, not a character trait.`,
    callToActionCopy: "Get Coaching on Opening Up Without Losing Yourself",
    datingCycleTeaser: [
      "You like someone ➜ you enjoy the connection but keep some distance",
      "They try to get closer ➜ you start to feel pressured or crowded",
      "You want more space ➜ you become less available or more reserved",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're pulling away when partners try to get closer",
      "You're saying you need space frequently",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Practice letting others in without losing yourself",
      "Recognize that interdependence is not weakness",
      "Allow yourself to need and be needed",
      "Stay present when closeness triggers flight",
      "Understanding the difference between healthy boundaries and walls",
    ],
  },

  // ========================================================================
  // AVOIDANT + PASSIVE: THE QUIET GHOST
  // ========================================================================
  {
    id: "quiet-ghost",
    name: "The Quiet Ghost",
    emoji: "🐢",
    image: "/archetypes/quiet-ghost-turtle.png",
    summary:
      "When relationships start to feel intense or demanding, you pull back. Instead of staying engaged, you create distance, and partners can be left feeling confused or shut out.",
    patternDescription: `When things become more emotionally real, your system can feel overloaded. Stepping back feels safer than staying in the moment. You go quiet, reply more slowly, or disappear for a while. For you, it's a way to calm down and get space. For the other person, it can look like you suddenly lost interest or stopped caring.`,
    rootCause: `You have avoidant attachment with passive communication. You learned that conflict = pain, so you escape. You also learned not to speak up, so you just withdraw instead of saying "I need space." Disappearing feels safer than communicating.`,
    callToActionCopy: "Get Coaching on Staying Present",
    datingCycleTeaser: [
      "Things get emotionally real ➜ you feel overwhelmed",
      "You need to escape ➜ you go quiet",
      "You take longer to respond ➜ you're busy or just not engaging",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're taking longer and longer to respond to texts",
      "When conflicts start, you go quiet or disappear",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Practice staying present during difficult conversations",
      "Communicate when you need space rather than vanishing",
      "Recognize withdrawal patterns before they damage bonds",
      "Build tolerance for emotional closeness gradually",
      "Use words instead of disappearing",
    ],
  },

  // ========================================================================
  // AVOIDANT + AGGRESSIVE: THE IRON FORTRESS
  // ========================================================================
  {
    id: "iron-fortress",
    name: "The Iron Fortress",
    emoji: "🦔",
    image: "/archetypes/iron-fortress-armadillo.png",
    summary:
      "You're highly protective of your inner world. When people get close, you respond with distance or sharpness, and relationships can start to feel risky rather than safe.",
    patternDescription: `Over time, you've learned to rely on strong defenses. Keeping some distance feels safer than letting someone in and possibly getting hurt. On the outside, you might look cold, harsh, or uninterested. Inside, you're mostly trying to stay safe, not trying to hurt anyone.`,
    rootCause: `You have avoidant attachment with aggressive communication. You learned that vulnerability = danger. People = pain. Your harshness is a defense mechanism. You attack first so you don't get hurt.`,
    callToActionCopy: "Get Coaching on Opening Your Heart",
    datingCycleTeaser: [
      "Someone tries to get close ➜ you feel threatened",
      "You respond harshly or coldly ➜ you're pushing them away",
      "They feel rejected ➜ they back off",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're telling people harsh things and justifying it as \"honesty\"",
      "You're pushing partners away before they can leave you",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Recognize that armor keeps out love too",
      "Practice vulnerability in small steps",
      "Soften defensive reactions",
      "Understand that past hurts do not have to define future relationships",
      "Learning gentleness without being weak",
    ],
  },

  // ========================================================================
  // AVOIDANT + PASSIVE-AGGRESSIVE: THE COOL MYSTERY
  // ========================================================================
  {
    id: "cool-mystery",
    name: "The Cool Mystery",
    emoji: "🐈",
    image: "/archetypes/cool-mystery-cat.png",
    summary:
      "You tend to stay emotionally distant in relationships. Partners often end up guessing what you're really thinking or feeling. When you're upset, you're more likely to pull back than to talk about it directly.",
    patternDescription: `You often keep your inner world private. You express displeasure through coldness or withdrawal rather than words, creating an air of mystery that can feel like rejection. From your side, this is a way of protecting yourself and calming down. From the other person's side, it can feel like you've suddenly pulled the plug on closeness.`,
    rootCause: `You have avoidant attachment with passive-aggressive communication. You learned not to speak up AND not to get close. When frustrated, you don't express it—you punish through withdrawal and coldness.`,
    callToActionCopy: "Get Coaching on Warm Communication",
    datingCycleTeaser: [
      "Something bothers you ➜ you don't say anything",
      "You go cold or distant ➜ your partner feels it",
      "They ask what's wrong ➜ you say \"nothing, I'm fine\"",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You go cold when frustrated instead of talking about it",
      "Your partners say \"I never know where I stand with you\"",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Express needs and frustrations directly",
      "Avoid silent treatment as a communication tool",
      "Let partners understand your emotional world",
      "Practice warmth even when it feels vulnerable",
      "Using words instead of coldness",
    ],
  },

  // ========================================================================
  // DISORGANIZED + ASSERTIVE: THE SELF-AWARE ALCHEMIST
  // ========================================================================
  {
    id: "self-aware-alchemist",
    name: "The Self-Aware Alchemist",
    emoji: "🐙",
    image: "/archetypes/self-aware-alchemist-octopus.png",
    summary:
      "You understand yourself very well. You can see your own patterns and explain them clearly. But turning this insight into action remains difficult.",
    patternDescription: `You're thoughtful and self-aware. You can describe your fears, triggers, and reactions in detail—even when your actions don't match what you say you want. You're not clueless about your issues; in fact, you might understand them better than most people. The challenge is that insight and change don't always move at the same speed. Your mind gets it, but your reactions still follow old habits.`,
    rootCause: `You have disorganized attachment with assertive communication. You can identify your patterns but haven't done the deeper work to change them. You might say "I know I sabotage relationships" but continue sabotaging them. Self-awareness without action.`,
    callToActionCopy: "Get Coaching on Turning Awareness Into Change",
    datingCycleTeaser: [
      "You meet someone ➜ you get emotionally invested and open up quickly",
      "Something triggers you ➜ you pull back hard, or create distance",
      "They try to understand ➜ you can explain your patterns and where they come from very clearly",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You can describe your patterns perfectly but repeat them anyway",
      "You say \"I know I'm going to sabotage this\" and then do it",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Align actions with stated intentions",
      "Build consistency in relationship behaviors",
      "Use insight to change, not just understand, patterns",
      "Seek professional support for deeper healing",
      "Moving from analysis to action",
    ],
  },

  // ========================================================================
  // DISORGANIZED + PASSIVE: THE CHAMELEON
  // ========================================================================
  {
    id: "chameleon",
    name: "The Chameleon",
    emoji: "🦎",
    image: "/archetypes/chameleon-chameleon.png",
    summary:
      "You're very good at adapting to other people. In relationships, you often change to fit what the other person seems to want, and over time it can feel like you've lost touch with your own needs and identity.",
    patternDescription: `You're sensitive to the people around you and quick to adjust. When you like someone, you naturally tune into their preferences, moods, and expectations. At first, this can make the connection feel smooth and easy. But as time goes on, the parts of you that don't really fit that version start to come out. You feel tired from keeping up the "ideal" version of yourself, and they feel confused because you suddenly don't seem like the person they first met.`,
    rootCause: `You have disorganized attachment with passive communication. You never learned a stable sense of self. You learned to be what others need to survive. Now you automatically shape-shift to keep people close.`,
    callToActionCopy: "Get Coaching on Finding Your True Self",
    datingCycleTeaser: [
      "You meet someone ➜ you quickly adapt and become the version you think they'll like",
      "They respond well to this version of you ➜ you feel seen and appreciated",
      "Over time, more of the \"real you\" shows up ➜ the differences start to feel noticeable",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You're completely different people with different partners",
      "You don't know who you are outside relationships",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Develop consistent sense of self",
      "Practice having opinions and preferences",
      "Stop abandoning yourself for acceptance",
      "Build stable identity independent of partners",
      "Learning to be yourself instead of adapting",
    ],
  },

  // ========================================================================
  // DISORGANIZED + AGGRESSIVE: THE WILD STORM
  // ========================================================================
  {
    id: "wild-storm",
    name: "The Wild Storm",
    emoji: "🐂",
    image: "/archetypes/wild-storm-bull.png",
    summary:
      "Your relationships can feel very intense—for you and for the other person. You swing between wanting a lot of closeness and then needing to push people away when it all feels too much.",
    patternDescription: `Your feelings in relationships tend to be strong. When you care about someone, you feel it deeply and get very involved. But when you're triggered, overwhelmed, or scared of getting hurt, your reactions can become big and sudden—pulling away or starting conflict. You're not trying to cause chaos; your emotions just move quickly, and it's hard to slow things down in the moment. For partners, this up-and-down pattern can feel confusing and tiring.`,
    rootCause: `You have disorganized attachment with aggressive communication. Your nervous system learned that relationships = danger + safety simultaneously. You swing between intense pursuit and aggressive rejection. You're not stable in the middle.`,
    callToActionCopy: "Get Coaching on Managing Your Intensity",
    datingCycleTeaser: [
      "You meet someone ➜ you get emotionally involved and attached quickly",
      "Something triggers you ➜ you react strongly, argue, or push them away",
      "They try to understand or calm things down ➜ you may still feel angry, hurt, or defensive",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You have intense blow-ups or aggressive moments in relationships",
      "You cycle between being all-in and pushing people away hard",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Learn emotional regulation techniques",
      "Pause before reacting in conflict",
      "Channel intensity into healthy expression",
      "Seek professional support for trauma healing",
      "Building stability in relationships",
    ],
  },

  // ========================================================================
  // DISORGANIZED + PASSIVE-AGGRESSIVE: THE LABYRINTH
  // ========================================================================
  {
    id: "labyrinth",
    name: "The Labyrinth",
    emoji: "🐍",
    image: "/archetypes/labyrinth-snake.png",
    summary:
      "You're layered and complex. In relationships, you can send mixed signals—sometimes warm, sometimes distant—so partners often feel unsure about where they stand with you.",
    patternDescription: `You feel a lot underneath the surface, and your feelings about closeness can change quickly. Part of you wants connection and intimacy; another part gets scared, guarded, or skeptical. You might test people without fully realizing it—pulling them closer to see if they care, then stepping back to see if they'll follow. You're not trying to play games; you're trying to feel safe and understood in a pattern that's hard even for you to untangle.`,
    rootCause: `You have disorganized attachment with passive-aggressive communication. You learned that relationships were unpredictable. You test people indirectly before committing. You communicate through manipulation rather than words.`,
    callToActionCopy: "Get Coaching on Clear Communication",
    datingCycleTeaser: [
      "You like someone ➜ you feel curious but also cautious, so you \"test\" how much they care",
      "You move closer, then suddenly create distance ➜ they feel confused by the change",
      "Your words and actions don't always match ➜ they're unsure what to believe",
    ],
    datingCycleTotalCount: 6,
    redFlagsTeaser: [
      "You test partners: \"If they really love me, they'll...\"",
      "You send mixed signals about how you feel",
    ],
    redFlagsTotalCount: 5,
    coachingFocus: [
      "Communicate directly rather than through hints or tests",
      "Recognize manipulation patterns, even unintentional ones",
      "Build trust through consistency",
      "Work with a professional on attachment patterns",
      "Learning to be transparent instead of mysterious",
    ],
  },
];
