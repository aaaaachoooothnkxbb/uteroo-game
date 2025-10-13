export type PhaseId = "menstruation" | "follicular" | "ovulatory" | "luteal";
export type CurrencyId = "comfort" | "spark" | "vibe" | "soothe";

export interface PhaseNeed {
  id: string;
  title: string;
  description: string;
  hpValue: number;
  telemetryKey: string;
  reward: {
    currency: CurrencyId;
    amount: number;
  };
  encouragement: string;
}

export interface HormoneProfile {
  estrogen: number[];
  progesterone: number[];
  lh: number[];
  fsh: number[];
}

export interface PhaseMiniGame {
  id: string;
  name: string;
  description: string;
  rewardPreview: string;
  sceneHint: string;
}

export interface PhaseExperienceConfig {
  id: PhaseId;
  displayName: string;
  tagline: string;
  heroEmoji: string;
  accentGradient: string;
  accentTextClass: string;
  accentRing: string;
  duration: number;
  currency: CurrencyId;
  needs: PhaseNeed[];
  hormoneProfile: HormoneProfile;
  miniGame: PhaseMiniGame;
  ritualsHeadline: string;
  supportiveCopy: string[];
}

export type LifeStageId =
  | "early-puberty"
  | "teen-explorer"
  | "young-adult"
  | "cycle-pro"
  | "whole-self-balancer"
  | "perimenopause"
  | "menopause"
  | "postmenopause";

export interface StageSpecificNeed {
  id: string;
  title: string;
  description: string;
  rewardHint: string;
}

export interface LifeStagePhaseOverride
  extends Partial<
    Omit<PhaseExperienceConfig, "id" | "needs" | "hormoneProfile" | "miniGame" | "supportiveCopy">
  > {
  needs?: PhaseNeed[];
  hormoneProfile?: HormoneProfile;
  miniGame?: PhaseMiniGame;
  supportiveCopy?: string[];
  additionalSupportiveCopy?: string[];
  stageSpecificNeeds?: StageSpecificNeed[];
}

export interface LifeStageExperienceConfig {
  id: LifeStageId;
  displayName: string;
  ageRange: string;
  summary: string;
  heroEmoji: string;
  highlightClass: string;
  stageFocus: string[];
  supportivePractices: string[];
  phaseOverrides?: Partial<Record<PhaseId, LifeStagePhaseOverride>>;
}

export type ResolvedPhaseExperienceConfig = PhaseExperienceConfig & {
  stageSpecificNeeds?: StageSpecificNeed[];
};

export const phaseSequence: PhaseId[] = [
  "menstruation",
  "follicular",
  "ovulatory",
  "luteal",
];

export const currencyLabels: Record<CurrencyId, string> = {
  comfort: "Comfort",
  spark: "Spark",
  vibe: "Vibe",
  soothe: "Soothe",
};

export const currencyEmojis: Record<CurrencyId, string> = {
  comfort: "🛋️",
  spark: "✨",
  vibe: "🎉",
  soothe: "🫧",
};

const menstruationHormones: HormoneProfile = {
  estrogen: [0.18, 0.24, 0.3],
  progesterone: [0.28, 0.24, 0.2],
  lh: [0.12, 0.14, 0.18],
  fsh: [0.44, 0.4, 0.36],
};

const follicularHormones: HormoneProfile = {
  estrogen: [0.32, 0.36, 0.42, 0.48, 0.54, 0.6, 0.68, 0.74, 0.8],
  progesterone: [0.18, 0.18, 0.16, 0.14, 0.14, 0.12, 0.12, 0.12, 0.12],
  lh: [0.18, 0.2, 0.22, 0.24, 0.26, 0.28, 0.32, 0.38, 0.46],
  fsh: [0.3, 0.28, 0.26, 0.24, 0.22, 0.22, 0.24, 0.26, 0.28],
};

const ovulatoryHormones: HormoneProfile = {
  estrogen: [0.82, 0.88, 0.92, 0.74],
  progesterone: [0.16, 0.18, 0.2, 0.28],
  lh: [0.58, 0.76, 1, 0.62],
  fsh: [0.32, 0.52, 0.72, 0.4],
};

const lutealHormones: HormoneProfile = {
  estrogen: [0.6, 0.56, 0.5, 0.46, 0.4, 0.36, 0.34, 0.32, 0.3, 0.28, 0.26, 0.24],
  progesterone: [0.36, 0.42, 0.48, 0.56, 0.6, 0.62, 0.6, 0.56, 0.52, 0.46, 0.4, 0.32],
  lh: [0.32, 0.28, 0.26, 0.24, 0.22, 0.22, 0.2, 0.2, 0.18, 0.18, 0.18, 0.18],
  fsh: [0.24, 0.22, 0.2, 0.2, 0.18, 0.18, 0.18, 0.18, 0.18, 0.2, 0.22, 0.24],
};

export const phaseConfigs: Record<PhaseId, PhaseExperienceConfig> = {
  menstruation: {
    id: "menstruation",
    displayName: "Menstruation Flatland",
    tagline: "Wrap yourself in softness and nourish your body with slow, cozy rituals.",
    heroEmoji: "🫶",
    accentGradient: "from-rose-100 via-rose-200 to-rose-300",
    accentTextClass: "text-rose-950",
    accentRing: "ring-rose-300/60",
    duration: 3,
    currency: "comfort",
    needs: [
      {
        id: "warmth",
        title: "Warmth Ritual",
        description: "Use a heat pack, warm bath, or layered blankets for 10 soothing minutes.",
        hpValue: 1,
        telemetryKey: "need_warmth",
        reward: { currency: "comfort", amount: 12 },
        encouragement: "Heat calms uterine muscles and signals your nervous system to relax.",
      },
      {
        id: "hydration",
        title: "Hydration Sip",
        description: "Infuse water with citrus or ginger and finish the full glass.",
        hpValue: 1,
        telemetryKey: "need_hydration",
        reward: { currency: "comfort", amount: 10 },
        encouragement: "Hydration supports blood volume and eases fatigue.",
      },
      {
        id: "iron_snack",
        title: "Iron Snack",
        description: "Enjoy an iron-rich bite like lentils, dates, or dark greens with vitamin C.",
        hpValue: 1,
        telemetryKey: "need_iron",
        reward: { currency: "comfort", amount: 14 },
        encouragement: "Replenish iron lost during bleeding to keep energy steady.",
      },
      {
        id: "stretch",
        title: "Gentle Stretch",
        description: "Do 5 minutes of pelvic tilts or cat-cow to release tension.",
        hpValue: 1,
        telemetryKey: "need_stretch",
        reward: { currency: "comfort", amount: 11 },
        encouragement: "Slow movement boosts circulation and soothes cramps.",
      },
    ],
    hormoneProfile: menstruationHormones,
    miniGame: {
      id: "pac-run",
      name: "Pac-Run: Cozy Dodge",
      description: "Glide through the low-energy landscape, dodging chill ghosts while collecting Comfort Dots.",
      rewardPreview: "+Comfort currency & Warm Pack cosmetic chances",
      sceneHint: "Short bursts with long cozy pauses keep your nervous system soothed.",
    },
    ritualsHeadline: "¡WHAT UTEROO NEEDS!",
    supportiveCopy: [
      "Journaling prompt: What would feel nourishing if you slowed down even more today?",
      "Try 4-7-8 breathing while the heat pack warms you—it reduces prostaglandin-linked cramps.",
    ],
  },
  follicular: {
    id: "follicular",
    displayName: "Follicular Uphill",
    tagline: "Curiosity is rising—sprinkle in light learning and playful movement.",
    heroEmoji: "🌱",
    accentGradient: "from-emerald-100 via-emerald-200 to-emerald-300",
    accentTextClass: "text-emerald-950",
    accentRing: "ring-emerald-300/60",
    duration: 9,
    currency: "spark",
    needs: [
      {
        id: "learn",
        title: "Learn Something Tiny",
        description: "Read or listen to one bite-sized idea that excites you.",
        hpValue: 1,
        telemetryKey: "need_learn",
        reward: { currency: "spark", amount: 12 },
        encouragement: "Estrogen boosts neuroplasticity—feed that curious brain!",
      },
      {
        id: "light_cardio",
        title: "Joyful Movement",
        description: "Dance, brisk walk, or flow yoga for 10 minutes at a chatty pace.",
        hpValue: 1,
        telemetryKey: "need_cardio",
        reward: { currency: "spark", amount: 13 },
        encouragement: "Aerobic movement elevates dopamine, syncing with your rising hormones.",
      },
      {
        id: "plan",
        title: "Mini Planning Ritual",
        description: "Pick one focus for the week and jot two playful steps toward it.",
        hpValue: 1,
        telemetryKey: "need_plan",
        reward: { currency: "spark", amount: 11 },
        encouragement: "Executive function thrives as estrogen climbs—let it support you.",
      },
      {
        id: "socialize",
        title: "Light Connection",
        description: "Send a voice note or meme check-in to someone you adore.",
        hpValue: 1,
        telemetryKey: "need_social",
        reward: { currency: "spark", amount: 10 },
        encouragement: "Oxytocin release pairs beautifully with the follicular energy lift.",
      },
    ],
    hormoneProfile: follicularHormones,
    miniGame: {
      id: "snake-bud",
      name: "Snake Bud",
      description: "Guide your curious serpent to Spark Seeds while weaving around blooming tiles.",
      rewardPreview: "+Spark currency & recipe unlock shards",
      sceneHint: "Momentum builds gently—stay responsive and playful as the speed ramps.",
    },
    ritualsHeadline: "¡WHAT UTEROO NEEDS!",
    supportiveCopy: [
      "Try pairing your planning ritual with a favorite playlist to anchor the habit.",
      "Protein-rich snacks stabilize blood sugar as your energy output grows.",
    ],
  },
  ovulatory: {
    id: "ovulatory",
    displayName: "Ovulatory Mountain",
    tagline: "Shine bright and connect—celebrate your peak energy with communal joy.",
    heroEmoji: "🎉",
    accentGradient: "from-amber-100 via-amber-200 to-amber-300",
    accentTextClass: "text-amber-950",
    accentRing: "ring-amber-300/60",
    duration: 4,
    currency: "vibe",
    needs: [
      {
        id: "connect",
        title: "Share Your Spark",
        description: "Host a mini moment—voice note, reel, or story about what lights you up.",
        hpValue: 1,
        telemetryKey: "need_connect",
        reward: { currency: "vibe", amount: 15 },
        encouragement: "LH surge heightens sociability—let yourself be seen.",
      },
      {
        id: "celebrate",
        title: "Micro Celebration",
        description: "Do a 30-second victory dance or gratitude cheer for something recent.",
        hpValue: 1,
        telemetryKey: "need_celebrate",
        reward: { currency: "vibe", amount: 12 },
        encouragement: "Positive affect reinforces hormone-driven confidence spikes.",
      },
      {
        id: "community",
        title: "Community Task",
        description: "Offer help or feedback in a group, forum, or friend thread.",
        hpValue: 1,
        telemetryKey: "need_community",
        reward: { currency: "vibe", amount: 14 },
        encouragement: "Collective reciprocity grounds the extroverted surge.",
      },
      {
        id: "dance",
        title: "Expressive Movement",
        description: "Freestyle dance, run, or flow to let your body celebrate being alive.",
        hpValue: 1,
        telemetryKey: "need_dance",
        reward: { currency: "vibe", amount: 13 },
        encouragement: "High-energy movement supports cardiovascular health at peak hormones.",
      },
    ],
    hormoneProfile: ovulatoryHormones,
    miniGame: {
      id: "social-shuffle",
      name: "Social Shuffle",
      description: "Hit rhythmic cues with friends-on-the-mountain energy for bonus Vibe Notes.",
      rewardPreview: "+Vibe currency & festival decor chances",
      sceneHint: "Keep tempo with the beat—precision unlocks community fireworks.",
    },
    ritualsHeadline: "¡WHAT UTEROO NEEDS!",
    supportiveCopy: [
      "Hydrate generously—electrolytes keep ovulatory glow from tipping into headaches.",
      "Channel extra energy into creative brainstorming before progesterone slows things.",
    ],
  },
  luteal: {
    id: "luteal",
    displayName: "Luteal Hill",
    tagline: "Nest gently, declutter stress, and honor the wind-down with mindful comforts.",
    heroEmoji: "🪻",
    accentGradient: "from-indigo-100 via-indigo-200 to-indigo-300",
    accentTextClass: "text-indigo-950",
    accentRing: "ring-indigo-300/60",
    duration: 12,
    currency: "soothe",
    needs: [
      {
        id: "declutter",
        title: "Tiny Declutter",
        description: "Tidy a micro-area—drawer, shelf, or desktop tile.",
        hpValue: 1,
        telemetryKey: "need_declutter",
        reward: { currency: "soothe", amount: 12 },
        encouragement: "External calm cues the brain to relax as progesterone peaks.",
      },
      {
        id: "breathwork",
        title: "Breath Sanctuary",
        description: "Practice 5 minutes of boxed breathing or extended exhales.",
        hpValue: 1,
        telemetryKey: "need_breathwork",
        reward: { currency: "soothe", amount: 11 },
        encouragement: "Breathwork lowers cortisol, easing luteal irritability.",
      },
      {
        id: "magnesium",
        title: "Magnesium Snack",
        description: "Enjoy almonds, dark chocolate, or a magnesium mocktail.",
        hpValue: 1,
        telemetryKey: "need_magnesium",
        reward: { currency: "soothe", amount: 13 },
        encouragement: "Magnesium supports muscle relaxation and sleep quality.",
      },
      {
        id: "slow_walk",
        title: "Slow Walk",
        description: "Take a sensory stroll noticing three soothing details.",
        hpValue: 1,
        telemetryKey: "need_walk",
        reward: { currency: "soothe", amount: 12 },
        encouragement: "Gentle movement regulates mood and keeps lymph moving.",
      },
    ],
    hormoneProfile: lutealHormones,
    miniGame: {
      id: "declutter-dash",
      name: "Declutter Dash",
      description: "Match cozy objects to clear space and earn Soothe Pebbles.",
      rewardPreview: "+Soothe currency & nest decor shards",
      sceneHint: "Mindful pacing keeps you grounded—no frantic swipes needed.",
    },
    ritualsHeadline: "¡WHAT UTEROO NEEDS!",
    supportiveCopy: [
      "Check-in: what boundaries help you protect rest as progesterone dips?",
      "Try a warm magnesium soak to ease PMS-related muscle tension.",
    ],
  },
};

export const defaultLifeStageId: LifeStageId = "young-adult";

const mergeSupportiveCopy = (
  base: string[],
  supportiveOverride?: string[],
  additional?: string[]
) => {
  if (supportiveOverride) {
    return [...supportiveOverride];
  }
  if (additional && additional.length > 0) {
    return [...base, ...additional];
  }
  return base;
};

export const lifeStageConfigs: Record<LifeStageId, LifeStageExperienceConfig> = {
  "early-puberty": {
    id: "early-puberty",
    displayName: "Early Bloom",
    ageRange: "10-12",
    summary:
      "Gentle cycle literacy for tweens discovering their first periods with safety, reassurance, and body autonomy lessons.",
    heroEmoji: "🌸",
    highlightClass: "bg-rose-100 text-rose-900",
    stageFocus: [
      "Normalize new bleeding experiences",
      "Build language for body sensations",
      "Connect with a trusted support team",
    ],
    supportivePractices: [
      "Use emoji stickers in a mood journal to notice patterns without pressure.",
      "Assemble a comfort kit with pads, period underwear, and a warm pack for school or sleepovers.",
      "Practice asking for help or supplies with scripted prompts that boost confidence.",
    ],
    phaseOverrides: {
      menstruation: {
        displayName: "First Flow Flatland",
        tagline: "Wrap first-period days with cozy rituals and a caring support squad.",
        heroEmoji: "🧸",
        stageSpecificNeeds: [
          {
            id: "comfort-kit",
            title: "Comfort Kit Check",
            description: "Gather pads, period underwear, and a snuggly item so surprises feel manageable.",
            rewardHint: "+Comfort for preparedness & body trust",
          },
          {
            id: "feelings-journal",
            title: "Feelings Journal",
            description: "Use stickers or emojis to describe how your body feels today.",
            rewardHint: "+Comfort for naming sensations",
          },
          {
            id: "trusted-ally",
            title: "Trusted Ally Chat",
            description: "Share one observation with a caregiver, coach, or mentor.",
            rewardHint: "+Comfort for courageous communication",
          },
        ],
        supportiveCopy: [
          "First periods can be unpredictable for up to two years—tracking feelings helps you spot your rhythm.",
          "Change pads or period underwear every 4–6 hours to stay comfy and leak-free.",
        ],
        miniGame: {
          id: "pac-run",
          name: "Pac-Run: Comfort Quest",
          description:
            "Guide your plush buddy to warm packs while practicing slow, calming breaths between moves.",
          rewardPreview: "+Comfort currency & sticker cosmetics for your first-period kit",
          sceneHint: "Short glides with mindful pauses keep cramps gentle for new menstruators.",
        },
      },
      follicular: {
        displayName: "Follicular Discovery",
        tagline: "Curiosity blooms—learn a tiny fact and celebrate how your body is growing.",
        heroEmoji: "🪴",
        stageSpecificNeeds: [
          {
            id: "science-spark",
            title: "Science Spark",
            description: "Watch a bite-sized puberty or anatomy video and note one wow moment.",
            rewardHint: "+Spark for health literacy",
          },
          {
            id: "playful-move",
            title: "Playful Move",
            description: "Dance, scooter, or stretch for five joyful minutes.",
            rewardHint: "+Spark for movement confidence",
          },
          {
            id: "friend-check",
            title: "Friend Check-In",
            description: "Send a meme or voice note to someone who makes you laugh.",
            rewardHint: "+Spark for supportive friendships",
          },
        ],
        supportiveCopy: [
          "Puberty hormones can make moods zig-zag—creative outlets and hydration keep things steadier.",
          "Learning about your anatomy builds body autonomy and informed decision making.",
        ],
        miniGame: {
          id: "snake-bud",
          name: "Snake Bud: Curiosity Trail",
          description: "Guide your curious serpent through new-growth tiles while collecting Spark Seeds.",
          rewardPreview: "+Spark currency & zine pages about puberty power",
          sceneHint: "Celebrate each gentle turn—your brain is learning fast.",
        },
      },
      ovulatory: {
        displayName: "Confidence Mountain",
        tagline: "Shine bright, share your wins, and practice healthy boundaries.",
        heroEmoji: "🌟",
        stageSpecificNeeds: [
          {
            id: "highlight-share",
            title: "Highlight Share",
            description: "Tell a friend or journal one thing you’re proud of this week.",
            rewardHint: "+Vibe for celebrating yourself",
          },
          {
            id: "hydrate-sparkle",
            title: "Hydrate Sparkle",
            description: "Sip sparkling water or a mocktail and notice how energized you feel.",
            rewardHint: "+Vibe for nourishing glow",
          },
          {
            id: "boundary-practice",
            title: "Boundary Practice",
            description: "Rehearse a kind ‘no thanks’ for invites that don’t feel right.",
            rewardHint: "+Vibe for self-respect",
          },
        ],
        supportiveCopy: [
          "Ovulation may be irregular right now—focus on body cues instead of calendar math.",
          "Keep protein-rich snacks nearby to steady energy spikes.",
        ],
        miniGame: {
          id: "social-shuffle",
          name: "Social Shuffle: Sparkle Squad",
          description: "Hit rhythm cues with your cheer squad and trade compliments between beats.",
          rewardPreview: "+Vibe currency & friendship bracelet charms",
          sceneHint: "Match the beat and your own pace—connection is the high score.",
        },
      },
      luteal: {
        displayName: "Cocoon Hill",
        tagline: "Wind down with gentle organization, calming rituals, and future-you care.",
        heroEmoji: "🛌",
        stageSpecificNeeds: [
          {
            id: "kit-restock",
            title: "Kit Restock",
            description: "Refresh your comfort kit so the next period arrives to a cozy setup.",
            rewardHint: "+Soothe for future-you kindness",
          },
          {
            id: "calm-breath",
            title: "Calm Breath",
            description: "Try five slow breaths with a forward fold or child’s pose.",
            rewardHint: "+Soothe for nervous system care",
          },
          {
            id: "affirm-kindness",
            title: "Affirm Kindness",
            description: "Say two affirmations about your changing body in the mirror.",
            rewardHint: "+Soothe for self-compassion",
          },
        ],
        supportiveCopy: [
          "Late-luteal tenderness is normal—cozy clothes and magnesium-rich snacks help.",
          "Track mood or skin changes to notice when extra support is helpful.",
        ],
        miniGame: {
          id: "declutter-dash",
          name: "Declutter Dash: Cozy Nest",
          description: "Match soothing objects to tidy your room corner and calm premenstrual jitters.",
          rewardPreview: "+Soothe currency & pastel decor for your nest",
          sceneHint: "Slow, steady matches feel best—no rush, just cozy focus.",
        },
      },
    },
  },
  "teen-explorer": {
    id: "teen-explorer",
    displayName: "Teen Explorer",
    ageRange: "13-17",
    summary:
      "Support teens balancing school, sport, creativity, and advocacy while hormones settle into steadier rhythms.",
    heroEmoji: "🛼",
    highlightClass: "bg-purple-100 text-purple-900",
    stageFocus: [
      "Link cycle patterns to school and sport performance",
      "Support skin, mood, and energy fluctuations",
      "Build consent and advocacy vocabulary",
    ],
    supportivePractices: [
      "Align heavy practice days with high-energy phases when possible.",
      "Create a shared language with coaches and caregivers for period-positive accommodations.",
      "Track acne, cramps, or mood shifts to advocate for clinical support when needed.",
    ],
    phaseOverrides: {
      menstruation: {
        displayName: "Menstruation Reset",
        tagline: "Slow your hustle, schedule relief, and invite supportive allies.",
        heroEmoji: "🩰",
        stageSpecificNeeds: [
          {
            id: "schedule-sweep",
            title: "Schedule Sweep",
            description: "Adjust your planner so heavy flow days include buffers for rest or shorter commitments.",
            rewardHint: "+Comfort for sustainable pacing",
          },
          {
            id: "relief-toolkit",
            title: "Relief Toolkit",
            description: "Pick one pain relief strategy—heat pack, stretching, meds—and set a reminder to use it.",
            rewardHint: "+Comfort for proactive care",
          },
          {
            id: "ally-text",
            title: "Ally Text",
            description: "Message a friend, coach, or parent about how they can support you today.",
            rewardHint: "+Comfort for community support",
          },
        ],
        supportiveCopy: [
          "If cramps keep you from school or practice, connect with a clinician—effective relief plans exist.",
          "Period-positive products (cups, period underwear) can increase comfort during long days.",
        ],
        miniGame: {
          id: "pac-run",
          name: "Pac-Run: Relief Relay",
          description: "Dash between cozy corners while queuing breathing exercises with your support crew.",
          rewardPreview: "+Comfort currency & empowerment playlist tracks",
          sceneHint: "Alternate quick strides with resets—your pacing is the power move.",
        },
      },
      follicular: {
        displayName: "Follicular Momentum",
        tagline: "Lean into curiosity, skill building, and positive self-image.",
        heroEmoji: "🎨",
        stageSpecificNeeds: [
          {
            id: "skill-step",
            title: "Skill Micro-Step",
            description: "Work on a hobby or subject for 15 focused minutes and log one insight.",
            rewardHint: "+Spark for mastery",
          },
          {
            id: "strength-spark",
            title: "Strength Spark",
            description: "Do a quick strength or cardio burst—stairs, jump rope, or dance combo.",
            rewardHint: "+Spark for powerful movement",
          },
          {
            id: "nourish-plate",
            title: "Nourish Plate",
            description: "Assemble a colorful meal or snack with protein, complex carbs, and fiber.",
            rewardHint: "+Spark for balanced fuel",
          },
        ],
        supportiveCopy: [
          "Track study or practice wins during follicular phases to schedule big efforts strategically.",
          "Hydrate before, during, and after movement to support muscle recovery.",
        ],
        miniGame: {
          id: "snake-bud",
          name: "Snake Bud: Idea Sprint",
          description: "Collect Spark Seeds that unlock new hobby prompts and confidence boosts.",
          rewardPreview: "+Spark currency & pep-talk voice notes",
          sceneHint: "Hold a steady rhythm—consistency outshines speed here.",
        },
      },
      ovulatory: {
        displayName: "Ovulatory Spotlight",
        tagline: "Channel peak energy into leadership, advocacy, and joyful connection.",
        heroEmoji: "📣",
        stageSpecificNeeds: [
          {
            id: "advocacy-note",
            title: "Advocacy Note",
            description: "Write a short message about a topic you care about—share or keep private.",
            rewardHint: "+Vibe for courageous voice",
          },
          {
            id: "celebrate-friend",
            title: "Celebrate a Friend",
            description: "Highlight someone’s win with a shout-out or supportive post.",
            rewardHint: "+Vibe for community joy",
          },
          {
            id: "consent-check",
            title: "Consent Check",
            description: "Revisit your boundaries and rehearse how you’ll communicate them.",
            rewardHint: "+Vibe for empowered choice",
          },
        ],
        supportiveCopy: [
          "Notice cervical fluid or temperature shifts—tracking now improves fertility knowledge later.",
          "Offset energy spikes with regular meals and downtime to prevent crashes.",
        ],
        miniGame: {
          id: "social-shuffle",
          name: "Social Shuffle: Spotlight",
          description: "Perform call-and-response rhythms with your hype team and score Vibe Notes.",
          rewardPreview: "+Vibe currency & activism poster frames",
          sceneHint: "Precision plus joy equals power—share the mic with friends.",
        },
      },
      luteal: {
        displayName: "Luteal Grounding",
        tagline: "Soothe nerves, prep for upcoming flow, and protect sleep.",
        heroEmoji: "🕯️",
        stageSpecificNeeds: [
          {
            id: "prep-box",
            title: "Prep Box Refresh",
            description: "Restock period products, teas, or chocolate so late-luteal you feels supported.",
            rewardHint: "+Soothe for future-you kindness",
          },
          {
            id: "sleep-reset",
            title: "Sleep Reset",
            description: "Try a 5-5-7 breath cycle or calming meditation before bed.",
            rewardHint: "+Soothe for restorative rest",
          },
          {
            id: "journal-reset",
            title: "Journal Reset",
            description: "Note one thing you’re proud of and one thing you’ll release before menstruation.",
            rewardHint: "+Soothe for reflective grounding",
          },
        ],
        supportiveCopy: [
          "Limit blue light 60 minutes before bed to support melatonin when progesterone dips.",
          "Anti-inflammatory foods (berries, leafy greens, omega-3s) cushion PMS symptoms.",
        ],
        miniGame: {
          id: "declutter-dash",
          name: "Declutter Dash: Study Nook",
          description: "Match mindful items to tidy your workspace and ease late-luteal overwhelm.",
          rewardPreview: "+Soothe currency & focus-boost desk decor",
          sceneHint: "Choose thoughtful matches—calm beats speed in this phase.",
        },
      },
    },
  },
  "young-adult": {
    id: "young-adult",
    displayName: "Young Adult Glow",
    ageRange: "18-24",
    summary:
      "Build confidence with your cyclical patterns while experimenting with routines that match student, early-career, or creative schedules.",
    heroEmoji: "🌈",
    highlightClass: "bg-sky-100 text-sky-900",
    stageFocus: [
      "Explore cycle syncing basics",
      "Balance study, social, and rest windows",
      "Experiment with joyful movement",
    ],
    supportivePractices: [
      "Block 90 minutes weekly for hormone-friendly meal prep.",
      "Pair major deadlines with luteal calm rituals to curb burnout.",
      "Celebrate ovulatory wins with community shout-outs to reinforce cycle literacy.",
    ],
    phaseOverrides: {
      menstruation: {
        additionalSupportiveCopy: [
          "Period pain that cancels plans each month deserves a chat with a trusted clinician—advocate for thorough care.",
        ],
        stageSpecificNeeds: [
          {
            id: "budget-rest",
            title: "Budget Your Rest",
            description: "Block off calendar space for slower mornings or remote work.",
            rewardHint: "+Comfort for sustainable pacing",
          },
        ],
      },
      follicular: {
        additionalSupportiveCopy: [
          "Brainstorm new hobbies or side quests during this dopamine-friendly stretch—track which ones feel sustainable.",
        ],
        stageSpecificNeeds: [
          {
            id: "skill-expansion",
            title: "Skill Expansion",
            description: "Invest 20 minutes in a course, reading, or creative prototype.",
            rewardHint: "+Spark for future visioning",
          },
        ],
      },
      ovulatory: {
        additionalSupportiveCopy: [
          "Practice consent-centered celebration by checking in with yourself before saying yes to every invite.",
        ],
        stageSpecificNeeds: [
          {
            id: "voice-share",
            title: "Share Your Voice",
            description: "Host a story, reel, or micro-event that spotlights your joy.",
            rewardHint: "+Vibe for courageous visibility",
          },
        ],
      },
      luteal: {
        additionalSupportiveCopy: [
          "Front-load collaborative work early luteal so late-luteal days can be reserved for solo focus and reflection.",
        ],
        stageSpecificNeeds: [
          {
            id: "self-compassion-audit",
            title: "Self-Compassion Audit",
            description: "List three tasks to postpone or delegate before PMS ramps up.",
            rewardHint: "+Soothe for boundaries",
          },
        ],
      },
    },
  },
  "cycle-pro": {
    id: "cycle-pro",
    displayName: "Cycle Pro",
    ageRange: "25-34",
    summary:
      "Optimize routines for careers, relationships, and creative ambitions while honoring cyclical energy swings.",
    heroEmoji: "🚀",
    highlightClass: "bg-emerald-100 text-emerald-900",
    stageFocus: [
      "Align big goals with hormone-informed energy",
      "Protect recovery alongside high-output weeks",
      "Invest in preventative health habits",
    ],
    supportivePractices: [
      "Schedule deep work sprints in follicular/ovulatory windows and lighter admin in late luteal.",
      "Batch cook iron-rich meals during high-energy days so menstruation remains cozy.",
      "Track sleep quality; advocate for workplace flexibility around heavy flow days.",
    ],
    phaseOverrides: {
      menstruation: {
        displayName: "Menstruation Retreat",
        tagline: "Delegate, nourish, and reset to keep long-term goals sustainable.",
        heroEmoji: "🛀",
        stageSpecificNeeds: [
          {
            id: "calendar-buffer",
            title: "Calendar Buffer",
            description: "Block 30-60 minutes of unscheduled time for the next two days to absorb surprises.",
            rewardHint: "+Comfort for nervous system repair",
          },
          {
            id: "iron-meal",
            title: "Iron Meal Prep",
            description: "Prepare or order an iron-rich meal paired with vitamin C for optimal absorption.",
            rewardHint: "+Comfort for replenished stores",
          },
          {
            id: "delegate-task",
            title: "Delegate One Task",
            description: "Hand off or postpone a non-essential task to honor your rest window.",
            rewardHint: "+Comfort for leadership sustainability",
          },
        ],
        supportiveCopy: [
          "Heavy bleeding, clotting, or day-ruining cramps merit medical follow-up—advocate for yourself.",
          "Pair period rest with strategic visioning: what do you want next month to feel like?",
        ],
        miniGame: {
          id: "pac-run",
          name: "Pac-Run: Retreat Mode",
          description: "Float through calm caves collecting warmth orbs while scheduling mini retreats.",
          rewardPreview: "+Comfort currency & spa-inspired decor",
          sceneHint: "Glide slowly—restful pacing is the winning strategy.",
        },
      },
      follicular: {
        displayName: "Follicular Launch",
        tagline: "Map projects, lift weights, and pitch bold ideas while estrogen fuels momentum.",
        heroEmoji: "💡",
        stageSpecificNeeds: [
          {
            id: "project-map",
            title: "Project Map",
            description: "Define the next big deliverable and break it into three playful milestones.",
            rewardHint: "+Spark for strategic clarity",
          },
          {
            id: "strength-train",
            title: "Strength Train",
            description: "Complete a resistance workout or brisk interval session that challenges you.",
            rewardHint: "+Spark for muscle momentum",
          },
          {
            id: "network-seed",
            title: "Network Seed",
            description: "Send a collaborative note or pitch to someone you want to build with.",
            rewardHint: "+Spark for ecosystem growth",
          },
        ],
        supportiveCopy: [
          "Stack social commitments when energy peaks to protect late-luteal quiet.",
          "Pair workouts with protein within 45 minutes to support muscle repair.",
        ],
        miniGame: {
          id: "snake-bud",
          name: "Snake Bud: Launch Path",
          description: "Navigate idea constellations to gather Spark Seeds for your next big project.",
          rewardPreview: "+Spark currency & pitch-deck boosts",
          sceneHint: "Plan ahead for turns—strategy equals success.",
        },
      },
      ovulatory: {
        displayName: "Ovulatory Spotlight",
        tagline: "Lead meetings, host gatherings, and share your voice with charisma.",
        heroEmoji: "🎤",
        stageSpecificNeeds: [
          {
            id: "signature-share",
            title: "Signature Share",
            description: "Host a live, reel, or workshop snippet featuring your expertise.",
            rewardHint: "+Vibe for magnetic visibility",
          },
          {
            id: "community-weave",
            title: "Community Weave",
            description: "Connect two people who would benefit from knowing each other.",
            rewardHint: "+Vibe for relational wealth",
          },
          {
            id: "hydration-guard",
            title: "Hydration Guard",
            description: "Prep an electrolyte drink before long speaking or networking blocks.",
            rewardHint: "+Vibe for sustained sparkle",
          },
        ],
        supportiveCopy: [
          "Notice cervical fluid shifts for fertility awareness if relevant to your plans.",
          "Schedule downtime post-events to avoid cortisol spikes from overstimulation.",
        ],
        miniGame: {
          id: "social-shuffle",
          name: "Social Shuffle: Spotlight",
          description: "Keep rhythm with community spotlights and collect Vibe Notes for collaboration perks.",
          rewardPreview: "+Vibe currency & stage-lighting decor",
          sceneHint: "Precision with flair wins—honor the beat and your boundaries.",
        },
      },
      luteal: {
        displayName: "Luteal Stewardship",
        tagline: "Refine systems, protect sleep, and close loops with compassion.",
        heroEmoji: "🌙",
        stageSpecificNeeds: [
          {
            id: "systems-review",
            title: "Systems Review",
            description: "Audit one workflow and note what to simplify before energy dips.",
            rewardHint: "+Soothe for operational ease",
          },
          {
            id: "sleep-halo",
            title: "Sleep Halo",
            description: "Create a 30-minute wind-down ritual with low light and screens off.",
            rewardHint: "+Soothe for restored hormones",
          },
          {
            id: "soothe-snack",
            title: "Soothe Snack",
            description: "Enjoy a magnesium-rich snack with complex carbs to steady blood sugar.",
            rewardHint: "+Soothe for steady moods",
          },
        ],
        supportiveCopy: [
          "Notice PMS mood shifts; therapy, SSRIs, or supplements may help—professional support is valid.",
          "Warm baths and compression gear soothe late-luteal tenderness.",
        ],
        miniGame: {
          id: "declutter-dash",
          name: "Declutter Dash: Ops Mode",
          description: "Match operational items to streamline your basecamp and reduce decision fatigue.",
          rewardPreview: "+Soothe currency & productivity boosters",
          sceneHint: "Steady focus beats speed—tie up loose ends with intention.",
        },
      },
    },
  },
  "whole-self-balancer": {
    id: "whole-self-balancer",
    displayName: "Whole-Self Balancer",
    ageRange: "35-44",
    summary:
      "Support caregivers, leaders, and multitaskers juggling families, careers, and health shifts in the late reproductive years.",
    heroEmoji: "🧘",
    highlightClass: "bg-amber-100 text-amber-900",
    stageFocus: [
      "Protect energy while juggling multiple responsibilities",
      "Prioritize recovery and nervous system regulation",
      "Monitor shifts that may signal perimenopause",
    ],
    supportivePractices: [
      "Batch family logistics during follicular windows when executive function peaks.",
      "Schedule regular pelvic floor and strength work to support longevity.",
      "Track PMS or cycle length changes to share with healthcare providers early.",
    ],
    phaseOverrides: {
      menstruation: {
        displayName: "Menstruation Sanctuary",
        tagline: "Honor heavier responsibilities with rest, nourishment, and delegation.",
        heroEmoji: "🫖",
        stageSpecificNeeds: [
          {
            id: "delegation-circle",
            title: "Delegation Circle",
            description: "Ask family or teammates to cover one task while you rest.",
            rewardHint: "+Comfort for shared load",
          },
          {
            id: "anti-inflammatory-bowl",
            title: "Anti-Inflammatory Bowl",
            description: "Prepare a meal with leafy greens, omega-3s, and fiber to calm cramps.",
            rewardHint: "+Comfort for reduced inflammation",
          },
          {
            id: "digital-boundary",
            title: "Digital Boundary",
            description: "Mute or log off work channels by 8pm for two consecutive nights.",
            rewardHint: "+Comfort for hormonal repair",
          },
        ],
        supportiveCopy: [
          "Monitor flow changes—fibroids or adenomyosis are more common in this decade and deserve proactive care.",
          "Slow mornings with warm beverages support digestion and cortisol balance.",
        ],
        miniGame: {
          id: "pac-run",
          name: "Pac-Run: Sanctuary",
          description: "Glide through a tranquil spa valley collecting heat packs and boundary tokens.",
          rewardPreview: "+Comfort currency & spa lighting upgrades",
          sceneHint: "Move intentionally and pause often—softness is the goal.",
        },
      },
      follicular: {
        displayName: "Follicular Strategist",
        tagline: "Design family and career systems with renewed clarity.",
        heroEmoji: "🗺️",
        stageSpecificNeeds: [
          {
            id: "system-sync",
            title: "System Sync",
            description: "Update shared calendars or task boards with upcoming commitments.",
            rewardHint: "+Spark for organized teams",
          },
          {
            id: "strength-session",
            title: "Strength Session",
            description: "Complete a progressive overload or Pilates class supporting bone density.",
            rewardHint: "+Spark for structural support",
          },
          {
            id: "creative-time",
            title: "Creative Time",
            description: "Spend 20 minutes on a passion project or journaling practice.",
            rewardHint: "+Spark for self-expression",
          },
          {
            id: "friend-microdate",
            title: "Friend Microdate",
            description: "Schedule a quick check-in with a friend or partner for connection.",
            rewardHint: "+Spark for relational joy",
          },
        ],
        supportiveCopy: [
          "Track ovulation signs even if pregnancy isn’t on the roadmap—cycle literacy aids future decisions.",
          "Pair workouts with protein and complex carbs to support recovery.",
        ],
        miniGame: {
          id: "snake-bud",
          name: "Snake Bud: Strategy Grove",
          description: "Navigate planning runes to collect Spark Seeds for your family systems.",
          rewardPreview: "+Spark currency & organizer decor",
          sceneHint: "Think two moves ahead while staying playful—balance is key.",
        },
      },
      ovulatory: {
        displayName: "Ovulatory Connector",
        tagline: "Leverage charisma for community building and joyful intimacy.",
        heroEmoji: "🤝",
        stageSpecificNeeds: [
          {
            id: "community-circle",
            title: "Community Circle",
            description: "Organize a quick gathering—digital or in-person—to share resources or wins.",
            rewardHint: "+Vibe for collective care",
          },
          {
            id: "intimacy-check",
            title: "Intimacy Check-In",
            description: "Communicate desires or boundaries with a partner or with yourself.",
            rewardHint: "+Vibe for confident connection",
          },
          {
            id: "celebrate-family",
            title: "Celebrate Family",
            description: "Share appreciation with family or chosen family for their support.",
            rewardHint: "+Vibe for gratitude",
          },
          {
            id: "hydrate-plus",
            title: "Hydrate +",
            description: "Sip electrolytes before intense movement or social plans to protect stamina.",
            rewardHint: "+Vibe for energized glow",
          },
        ],
        supportiveCopy: [
          "Embrace libido changes—communication keeps intimacy collaborative.",
          "Schedule joyful movement with loved ones to strengthen bonds.",
        ],
        miniGame: {
          id: "social-shuffle",
          name: "Social Shuffle: Connector",
          description: "Keep rhythm while inviting NPCs to collaborate on family or community quests.",
          rewardPreview: "+Vibe currency & gathering decor",
          sceneHint: "Share the spotlight generously for bonus multipliers.",
        },
      },
      luteal: {
        displayName: "Luteal Restoration",
        tagline: "Soothe overstimulation, prep for menstruation, and reinforce boundaries.",
        heroEmoji: "🛌",
        stageSpecificNeeds: [
          {
            id: "pantry-prep",
            title: "Pantry Prep",
            description: "Stock magnesium-rich snacks, teas, or supplements for PMS ease.",
            rewardHint: "+Soothe for future-you calm",
          },
          {
            id: "nervous-system-pause",
            title: "Nervous System Pause",
            description: "Practice 5-5-7 breathing or progressive muscle relaxation before bed.",
            rewardHint: "+Soothe for regulated emotions",
          },
          {
            id: "emotional-debrief",
            title: "Emotional Debrief",
            description: "Journal one frustration, one gratitude, and one boundary to uphold.",
            rewardHint: "+Soothe for emotional clarity",
          },
        ],
        supportiveCopy: [
          "Consider tracking luteal mood changes alongside nutrition and sleep to spot patterns early.",
          "Gentle stretching or yin yoga keeps mobility and lymph flow supported.",
        ],
        miniGame: {
          id: "declutter-dash",
          name: "Declutter Dash: Cozy Den",
          description: "Match soothing objects to restore your living space and calm late-luteal tension.",
          rewardPreview: "+Soothe currency & sanctuary decor",
          sceneHint: "Steady breathing while sorting delivers the most glow.",
        },
      },
    },
  },
  "perimenopause": {
    id: "perimenopause",
    displayName: "Perimenopause Navigator",
    ageRange: "45-51",
    summary:
      "Navigate shifting hormone patterns, cycle variability, and symptom management while protecting nervous system resilience.",
    heroEmoji: "🧭",
    highlightClass: "bg-orange-100 text-orange-900",
    stageFocus: [
      "Track cycle changes to inform supportive care",
      "Build anti-inflammatory rituals and stress buffering",
      "Celebrate wisdom while normalizing help-seeking",
    ],
    supportivePractices: [
      "Log cycle length, flow intensity, and PMS shifts to discuss with healthcare providers.",
      "Anchor consistent strength, mobility, and pelvic floor work to protect bones and joints.",
      "Introduce cooling bedtime routines to mitigate hot flashes and sleep disruptions.",
    ],
    phaseOverrides: {
      menstruation: {
        displayName: "Menstruation Recalibrate",
        tagline: "Soothe heavier or irregular bleeding with nourishment and delegation.",
        heroEmoji: "🩸",
        stageSpecificNeeds: [
          {
            id: "flow-log",
            title: "Flow Log",
            description: "Track bleeding intensity, clotting, and symptoms to share with your clinician.",
            rewardHint: "+Comfort for informed advocacy",
          },
          {
            id: "anti-inflammatory-meal",
            title: "Anti-Inflammatory Meal",
            description: "Enjoy a meal rich in omega-3s, leafy greens, and turmeric or ginger.",
            rewardHint: "+Comfort for inflammation support",
          },
          {
            id: "restorative-nap",
            title: "Restorative Nap",
            description: "Schedule a 20-minute nap or yoga nidra session to restore energy.",
            rewardHint: "+Comfort for adrenal relief",
          },
        ],
        supportiveCopy: [
          "Sudden increases in flow or cycles under 21 days deserve medical attention—track and advocate.",
          "Iron and B12 support may be helpful; consult your healthcare team for labs.",
        ],
        miniGame: {
          id: "pac-run",
          name: "Pac-Run: Recalibrate",
          description: "Float gently through soothing caverns collecting anti-inflammatory orbs.",
          rewardPreview: "+Comfort currency & herbal tea decor",
          sceneHint: "Slow navigation with intentional breaths keeps tension low.",
        },
      },
      follicular: {
        displayName: "Follicular Renewal",
        tagline: "Harness lighter days for strength work, brain focus, and joyful planning.",
        heroEmoji: "🌿",
        stageSpecificNeeds: [
          {
            id: "resistance-training",
            title: "Resistance Training",
            description: "Complete a strength or Pilates session emphasizing bone density and mobility.",
            rewardHint: "+Spark for longevity",
          },
          {
            id: "brain-focus",
            title: "Brain Focus",
            description: "Do a 20-minute deep work sprint and note how cognition feels today.",
            rewardHint: "+Spark for cognitive clarity",
          },
          {
            id: "joy-plan",
            title: "Joy Plan",
            description: "Schedule a micro-adventure or creative outlet that excites you.",
            rewardHint: "+Spark for dopamine boosts",
          },
        ],
        supportiveCopy: [
          "Perimenopause can shorten follicular length—use energy bursts without overbooking.",
          "Balance strength work with recovery modalities like massage, foam rolling, or sauna.",
        ],
        miniGame: {
          id: "snake-bud",
          name: "Snake Bud: Renewal Run",
          description: "Collect Spark Seeds that unlock supportive supplements and joyful micro-habits.",
          rewardPreview: "+Spark currency & adaptogen lore",
          sceneHint: "Alternate focused strides with reflective pauses to stay balanced.",
        },
      },
      ovulatory: {
        displayName: "Ovulatory Pulse",
        tagline: "Celebrate connection and self-expression—even if ovulation occasionally skips a beat.",
        heroEmoji: "✨",
        stageSpecificNeeds: [
          {
            id: "symptom-check",
            title: "Symptom Check",
            description: "Notice cervical fluid, mood, or libido changes—even anovulatory cycles offer insights.",
            rewardHint: "+Vibe for body literacy",
          },
          {
            id: "social-spark",
            title: "Social Spark",
            description: "Host or attend a gathering that nourishes your curiosity and advocacy.",
            rewardHint: "+Vibe for community energy",
          },
          {
            id: "cool-hydrate",
            title: "Cool Hydrate",
            description: "Sip chilled electrolyte drinks to offset sudden warmth or night sweats.",
            rewardHint: "+Vibe for temperature balance",
          },
        ],
        supportiveCopy: [
          "If ovulation feels unpredictable, tracking basal body temperature or LH surges can reveal patterns.",
          "Blend social time with quiet decompression to avoid overwhelm.",
        ],
        miniGame: {
          id: "social-shuffle",
          name: "Social Shuffle: Pulse",
          description: "Flow through rhythm cues while inviting NPCs to swap wisdom about hormone shifts.",
          rewardPreview: "+Vibe currency & advocacy toolkits",
          sceneHint: "Balance bright steps with grounding pauses for bonus multipliers.",
        },
      },
      luteal: {
        displayName: "Luteal Soothe",
        tagline: "Calm nervous system spikes, prioritize sleep, and nourish with stabilizing nutrients.",
        heroEmoji: "🌙",
        stageSpecificNeeds: [
          {
            id: "nervous-downshift",
            title: "Nervous Downshift",
            description: "Practice box breathing or legs-up-the-wall for 10 minutes.",
            rewardHint: "+Soothe for cortisol harmony",
          },
          {
            id: "sleep-guard",
            title: "Sleep Guard",
            description: "Stack sleep hygiene tools—dim lights, cooling sheets, or magnesium—before bed.",
            rewardHint: "+Soothe for restorative sleep",
          },
          {
            id: "nutrient-support",
            title: "Nutrient Support",
            description: "Enjoy a blood-sugar steady snack with protein, fiber, and healthy fats.",
            rewardHint: "+Soothe for steady moods",
          },
        ],
        supportiveCopy: [
          "Mood variability can intensify—consider talking therapies, SSRIs, or supplements with a clinician.",
          "Gentle cardio or walking outdoors boosts serotonin and reduces bloating.",
        ],
        miniGame: {
          id: "declutter-dash",
          name: "Declutter Dash: Moonlit Den",
          description: "Arrange calming objects and cooling packs to prepare for deep rest.",
          rewardPreview: "+Soothe currency & cooling textiles",
          sceneHint: "Slow, even matches reward grounding over speed.",
        },
      },
    },
  },
  "menopause": {
    id: "menopause",
    displayName: "Menopause Reframe",
    ageRange: "52-58",
    summary:
      "Design a hormone-stable wellness loop that prioritizes bone density, cardiovascular health, cognitive support, and joyful reinvention.",
    heroEmoji: "🕊️",
    highlightClass: "bg-blue-100 text-blue-900",
    stageFocus: [
      "Soothe vasomotor symptoms with cooling and nervous system care",
      "Invest in strength, mobility, and pelvic floor resilience",
      "Re-envision identity, intimacy, and legacy beyond cycles",
    ],
    supportivePractices: [
      "Layer strength training, impact work, and balance drills three times per week.",
      "Partner with clinicians on hormone therapy, adaptogens, or supplements tailored to your needs.",
      "Craft rituals celebrating wisdom—mentorship, journaling, or advocacy projects.",
    ],
    phaseOverrides: {
      menstruation: {
        displayName: "Menopause Renewal Flatland",
        tagline: "Center cooling rituals, restorative rest, and nutrient-rich comfort.",
        heroEmoji: "❄️",
        stageSpecificNeeds: [
          {
            id: "cooling-ritual",
            title: "Cooling Ritual",
            description: "Set up a cooling kit with mist, fan, or chilled jade roller for night or day flushes.",
            rewardHint: "+Comfort for symptom relief",
          },
          {
            id: "bone-boost",
            title: "Bone Boost Movement",
            description: "Practice weight-bearing or resistance moves for 10-15 minutes.",
            rewardHint: "+Comfort for long-term strength",
          },
          {
            id: "community-story",
            title: "Community Story",
            description: "Share a wisdom snippet with friends, mentees, or journaling prompts.",
            rewardHint: "+Comfort for legacy love",
          },
        ],
        supportiveCopy: [
          "Menopause is confirmed after 12 months without a period—celebrate the transition in your own way.",
          "Track symptoms like hot flashes, mood shifts, or joint discomfort to tailor support plans.",
        ],
        miniGame: {
          id: "pac-run",
          name: "Pac-Run: Renewal Drift",
          description: "Glide through moonlit caverns collecting cooling breezes and nourishment orbs.",
          rewardPreview: "+Comfort currency & serene lounge decor",
          sceneHint: "Move slowly and soak up every restorative current.",
        },
      },
      follicular: {
        displayName: "Spark Season",
        tagline: "Channel creativity, cognitive challenges, and purposeful projects.",
        heroEmoji: "🧠",
        stageSpecificNeeds: [
          {
            id: "cognitive-play",
            title: "Cognitive Play",
            description: "Complete a brain teaser, language lesson, or strategy game session.",
            rewardHint: "+Spark for neuroplasticity",
          },
          {
            id: "purpose-project",
            title: "Purpose Project",
            description: "Advance a passion project or volunteer effort that matters to you.",
            rewardHint: "+Spark for meaning",
          },
          {
            id: "movement-fusion",
            title: "Movement Fusion",
            description: "Blend strength, mobility, and joyful cardio in a 20-minute circuit.",
            rewardHint: "+Spark for vibrant body",
          },
        ],
        supportiveCopy: [
          "Brain fog can improve with consistent sleep, hydration, and cognitive challenges.",
          "Maintain protein intake (~1g/kg+) to support muscle, brain, and hormone balance.",
        ],
        miniGame: {
          id: "snake-bud",
          name: "Snake Bud: Spark Season",
          description: "Collect Spark Seeds tied to mentorship, creativity, and lifelong learning.",
          rewardPreview: "+Spark currency & knowledge artifacts",
          sceneHint: "Mix swift turns with mindful pauses to keep energy steady.",
        },
      },
      ovulatory: {
        displayName: "Connection Festival",
        tagline: "Celebrate relationships, intimacy, and community leadership in new forms.",
        heroEmoji: "🎊",
        stageSpecificNeeds: [
          {
            id: "intimacy-explore",
            title: "Intimacy Explore",
            description: "Experiment with lubricants, toys, or scripts to support comfortable pleasure.",
            rewardHint: "+Vibe for embodied joy",
          },
          {
            id: "mentor-circle",
            title: "Mentor Circle",
            description: "Host or join a wisdom circle, support group, or advocacy meeting.",
            rewardHint: "+Vibe for collective wisdom",
          },
          {
            id: "celebration-toast",
            title: "Celebration Toast",
            description: "Design a ritual that honors your evolving identity—music, art, or gratitude.",
            rewardHint: "+Vibe for self-honoring",
          },
        ],
        supportiveCopy: [
          "Lubricants, pelvic floor therapy, and hormonal support can rekindle comfortable intimacy—ask for care.",
          "Leadership through mentorship or volunteering keeps community bonds strong.",
        ],
        miniGame: {
          id: "social-shuffle",
          name: "Social Shuffle: Celebration",
          description: "Dance through rhythmic memories while uplifting NPCs with affirmations.",
          rewardPreview: "+Vibe currency & celebration lanterns",
          sceneHint: "Playful improvisation and boundary check-ins earn bonus streaks.",
        },
      },
      luteal: {
        displayName: "Grounding Glow",
        tagline: "Restore, journal, and tend to sleep hygiene to keep mood and cognition bright.",
        heroEmoji: "🪷",
        stageSpecificNeeds: [
          {
            id: "sleep-ritual",
            title: "Sleep Ritual",
            description: "Layer cool sheets, breathwork, and gentle stretches before bed.",
            rewardHint: "+Soothe for nightly renewal",
          },
          {
            id: "gratitude-journal",
            title: "Gratitude Journal",
            description: "Write three things you appreciate about your body and wisdom.",
            rewardHint: "+Soothe for emotional anchoring",
          },
          {
            id: "nature-dose",
            title: "Nature Dose",
            description: "Take a mindful walk focusing on sensory delights to ease stress.",
            rewardHint: "+Soothe for nervous system calm",
          },
        ],
        supportiveCopy: [
          "Mind-body therapies—tai chi, meditation, EMDR—support cognition and mood through menopause.",
          "Regular checkups for bone density, heart health, and thyroid function keep long-term wellbeing prioritized.",
        ],
        miniGame: {
          id: "declutter-dash",
          name: "Declutter Dash: Glow Retreat",
          description: "Arrange restful objects, plants, and soft lighting to craft a nightly sanctuary.",
          rewardPreview: "+Soothe currency & serenity furnishings",
          sceneHint: "Gentle, intentional matches cultivate the deepest glow.",
        },
      },
    },
  },
  "postmenopause": {
    id: "postmenopause",
    displayName: "Postmenopause Sage",
    ageRange: "59-65",
    summary:
      "Sustain long-term vitality, intergenerational impact, and playful exploration with stable hormone baselines.",
    heroEmoji: "🌅",
    highlightClass: "bg-violet-100 text-violet-900",
    stageFocus: [
      "Prioritize cardiovascular, bone, and cognitive longevity",
      "Champion advocacy for younger generations",
      "Celebrate creativity, travel, and purpose-driven rest",
    ],
    supportivePractices: [
      "Maintain annual screenings (DEXA, heart health, pelvic exams) and adjust wellness plans as needed.",
      "Blend strength, balance, and joyful movement (dance, tai chi, swimming) weekly.",
      "Document stories, recipes, or traditions to pass along while embracing new adventures.",
    ],
    phaseOverrides: {
      menstruation: {
        displayName: "Wisdom Flatland",
        tagline: "Move at a cozy pace while tending to preventative care and legacy projects.",
        heroEmoji: "📜",
        stageSpecificNeeds: [
          {
            id: "screening-plan",
            title: "Screening Plan",
            description: "Schedule or log annual labs, mammograms, colonoscopies, and dental or vision checks.",
            rewardHint: "+Comfort for proactive health",
          },
          {
            id: "strength-balance",
            title: "Strength & Balance",
            description: "Complete a balance drill or resistance set focused on hips, ankles, and core.",
            rewardHint: "+Comfort for steady mobility",
          },
          {
            id: "legacy-letter",
            title: "Legacy Letter",
            description: "Write a note, recipe, or memory you want future generations to hold.",
            rewardHint: "+Comfort for storytelling",
          },
        ],
        supportiveCopy: [
          "Bone density checks every 1-2 years guide supplements, medication, or training adjustments.",
          "Continue pelvic floor exercises and hormone conversations to support intimacy and continence.",
        ],
        miniGame: {
          id: "pac-run",
          name: "Pac-Run: Sage Drift",
          description: "Collect heirloom sparks while navigating serene pathways at your preferred pace.",
          rewardPreview: "+Comfort currency & heritage decor",
          sceneHint: "Gentle, mindful paths reveal the richest rewards.",
        },
      },
      follicular: {
        displayName: "Curiosity Season",
        tagline: "Explore new knowledge, travel dreams, and creative delights.",
        heroEmoji: "🧭",
        stageSpecificNeeds: [
          {
            id: "lifelong-learning",
            title: "Lifelong Learning",
            description: "Spend 20 minutes in a class, book, or documentary that inspires you.",
            rewardHint: "+Spark for expanding horizons",
          },
          {
            id: "adventure-plan",
            title: "Adventure Plan",
            description: "Map a mini getaway, museum visit, or neighborhood exploration.",
            rewardHint: "+Spark for joyful anticipation",
          },
          {
            id: "mentor-moment",
            title: "Mentor Moment",
            description: "Offer guidance or encouragement to someone younger or new to a journey.",
            rewardHint: "+Spark for community growth",
          },
        ],
        supportiveCopy: [
          "Hobbies that challenge balance, coordination, or languages keep neuroplasticity thriving.",
          "Ensure hydration and electrolytes during travel or adventurous outings.",
        ],
        miniGame: {
          id: "snake-bud",
          name: "Snake Bud: Explorer Path",
          description: "Collect Spark Seeds representing destinations, books, and creative collaborations.",
          rewardPreview: "+Spark currency & travel mementos",
          sceneHint: "Choose exploratory routes to unlock hidden treasures.",
        },
      },
      ovulatory: {
        displayName: "Community Glow",
        tagline: "Share wisdom, volunteer, and celebrate intergenerational joy.",
        heroEmoji: "🎁",
        stageSpecificNeeds: [
          {
            id: "volunteer-shift",
            title: "Volunteer Shift",
            description: "Spend time with a cause—mentoring, community garden, or advocacy hotline.",
            rewardHint: "+Vibe for service",
          },
          {
            id: "joy-share",
            title: "Joy Share",
            description: "Host a gathering, send a surprise gift, or record a message for loved ones.",
            rewardHint: "+Vibe for relational sparkle",
          },
          {
            id: "advocacy-check",
            title: "Advocacy Check",
            description: "Review policy updates or donate to reproductive justice initiatives.",
            rewardHint: "+Vibe for rights protection",
          },
        ],
        supportiveCopy: [
          "Community engagement supports mental health, cognition, and longevity.",
          "Blend festive events with rest windows to avoid overexertion.",
        ],
        miniGame: {
          id: "social-shuffle",
          name: "Social Shuffle: Glow",
          description: "Lead intergenerational dances while passing on advocacy wisdom.",
          rewardPreview: "+Vibe currency & celebration tapestries",
          sceneHint: "Alternate gentle moves with expressive moments for harmony.",
        },
      },
      luteal: {
        displayName: "Ember Evenings",
        tagline: "Anchor sleep, savor gratitude, and restore through mindful movement.",
        heroEmoji: "🕯️",
        stageSpecificNeeds: [
          {
            id: "sleep-anchor",
            title: "Sleep Anchor",
            description: "Keep a consistent bedtime routine with calming scents and low lights.",
            rewardHint: "+Soothe for restorative nights",
          },
          {
            id: "gratitude-share",
            title: "Gratitude Share",
            description: "Tell someone why you appreciate them or journal a memory from the day.",
            rewardHint: "+Soothe for joyful reflection",
          },
          {
            id: "movement-restore",
            title: "Movement Restore",
            description: "Enjoy tai chi, gentle yoga, or aqua movement to keep joints mobile.",
            rewardHint: "+Soothe for limber comfort",
          },
        ],
        supportiveCopy: [
          "Sleep quality is a longevity superpower—consider sleep studies or therapies if rest feels elusive.",
          "Regular social connection, learning, and movement protect brain health well into later decades.",
        ],
        miniGame: {
          id: "declutter-dash",
          name: "Declutter Dash: Ember Den",
          description: "Arrange memory boxes, candles, and cozy textiles to close the day with gratitude.",
          rewardPreview: "+Soothe currency & heirloom shelves",
          sceneHint: "Lingering on meaningful items yields deeper calm than rushing."
        },
      },
    },
  },
};


export const resolvePhaseExperience = (
  phase: PhaseId,
  lifeStageId: LifeStageId = defaultLifeStageId
): ResolvedPhaseExperienceConfig => {
  const base = phaseConfigs[phase];
  const stage = lifeStageConfigs[lifeStageId];
  const override = stage?.phaseOverrides?.[phase];

  if (!override) {
    return { ...base };
  }

  const {
    stageSpecificNeeds,
    additionalSupportiveCopy,
    supportiveCopy: supportiveOverride,
    ...rest
  } = override;

  const supportiveCopy = mergeSupportiveCopy(
    base.supportiveCopy,
    supportiveOverride,
    additionalSupportiveCopy
  );
  const miniGame = rest.miniGame
    ? { ...base.miniGame, ...rest.miniGame }
    : base.miniGame;

  return {
    ...base,
    ...rest,
    id: base.id,
    needs: rest.needs ?? base.needs,
    hormoneProfile: rest.hormoneProfile ?? base.hormoneProfile,
    miniGame,
    supportiveCopy,
    stageSpecificNeeds: stageSpecificNeeds ?? undefined,
  };
};

export const moodBuckets: Record<
  -2 | -1 | 0 | 1 | 2,
  {
    label: "low" | "meh" | "ok" | "bright" | "radiant";
    emoji: string;
    message: string;
  }
> = {
  [-2]: {
    label: "low",
    emoji: "🌧️",
    message: "Energy is tender—lean on warmth and grounded rituals.",
  },
  [-1]: {
    label: "meh",
    emoji: "🌥️",
    message: "Things feel a bit muted—gentle pacing will help.",
  },
  [0]: {
    label: "ok",
    emoji: "🌈",
    message: "Balanced vibes—keep honoring what your body asks for.",
  },
  [1]: {
    label: "bright",
    emoji: "☀️",
    message: "You’re glowing—channel it into nourishing micro-missions.",
  },
  [2]: {
    label: "radiant",
    emoji: "✨",
    message: "Peak sparkle—share it and celebrate your cycle literacy!",
  },
};
