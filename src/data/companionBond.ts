import { PhaseId, CurrencyId } from "@/data/phaseExperience";

export type CheckInFeeling =
  | "proud"
  | "calm"
  | "tired"
  | "overwhelmed"
  | "excited"
  | "reflective";

export interface CheckInFeelingConfig {
  id: CheckInFeeling;
  label: string;
  prompt: string;
  response: string;
  xp: number;
  reward: { currency: CurrencyId; amount: number };
}

export interface CompanionOutfit {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  inspiration: string;
}

export interface CompanionAdventure {
  id: string;
  phase: PhaseId;
  title: string;
  description: string;
  durationMinutes: number;
  reward: { currency: CurrencyId; amount: number };
  inspiration: string;
  successCopy: string;
}

export interface CompanionBondTitles {
  level: number;
  title: string;
}

export const maxDailyCheckIns = 3;

export const feelingConfigs: Record<CheckInFeeling, CheckInFeelingConfig> = {
  proud: {
    id: "proud",
    label: "Proud",
    prompt: "What made you proud today?",
    response:
      "Uteroo beams, flapping their little fins — they love hearing about your wins!",
    xp: 35,
    reward: { currency: "spark", amount: 12 },
  },
  calm: {
    id: "calm",
    label: "Calm",
    prompt: "Where did you find calm or grounding?",
    response:
      "Deep breaths together. Your steadiness helps Uteroo glide through the day.",
    xp: 28,
    reward: { currency: "soothe", amount: 10 },
  },
  tired: {
    id: "tired",
    label: "Tired",
    prompt: "What drained your energy?",
    response:
      "Uteroo tucks in beside you with a warm blanket and a mindful stretch reminder.",
    xp: 24,
    reward: { currency: "comfort", amount: 9 },
  },
  overwhelmed: {
    id: "overwhelmed",
    label: "Overwhelmed",
    prompt: "What felt like a lot today?",
    response:
      "Together you name the stressor and queue up a cozy micro-ritual to reset.",
    xp: 32,
    reward: { currency: "comfort", amount: 11 },
  },
  excited: {
    id: "excited",
    label: "Excited",
    prompt: "What are you looking forward to?",
    response:
      "Uteroo twirls with joy and plots the next community adventure to match your vibe!",
    xp: 34,
    reward: { currency: "vibe", amount: 12 },
  },
  reflective: {
    id: "reflective",
    label: "Reflective",
    prompt: "What did you learn about your cycle or yourself today?",
    response:
      "Notes saved to the Cycle Journal — Uteroo cherishes your insights for tomorrow's mood boost.",
    xp: 36,
    reward: { currency: "spark", amount: 11 },
  },
};

export const outfitCatalog: CompanionOutfit[] = [
  {
    id: "aurora-wrap",
    name: "Aurora Wrap",
    description: "A gentle glow that mirrors calm evening skies — unlocked from the start.",
    unlockLevel: 1,
    inspiration: "Finch's cozy starter outfits that anchor emotional safety.",
  },
  {
    id: "focus-forest-cloak",
    name: "Focus Forest Cloak",
    description: "Leafy cape stitched with tiny bells that chime when you hold focus blocks.",
    unlockLevel: 2,
    inspiration: "Forest & Flora focus gardens meet Animal Crossing's Able Sisters shop.",
  },
  {
    id: "festival-firefly-scarf",
    name: "Festival Firefly Scarf",
    description: "Sparkling scarf collected from Ovulatory Mountain festivals and socials.",
    unlockLevel: 3,
    inspiration: "Animal Crossing seasonal events with Finch's celebration dances.",
  },
  {
    id: "community-quest-vest",
    name: "Community Quest Vest",
    description:
      "Patchwork vest representing every villager you've helped this cycle — warm and proud.",
    unlockLevel: 4,
    inspiration: "Habitica-style quest badges blended with Animal Crossing villager favors.",
  },
  {
    id: "starlit-mentor-robes",
    name: "Starlit Mentor Robes",
    description:
      "Soft robes sparkling with constellations, gifted when you coach others through their cycle journey.",
    unlockLevel: 5,
    inspiration: "SuperBetter mentor roles and Fabulous' ritual guides wrapped in neon glam.",
  },
];

export const bondTitles: CompanionBondTitles[] = [
  { level: 1, title: "New Nest Ally" },
  { level: 2, title: "Ritual Sidekick" },
  { level: 3, title: "Cycle Confidant" },
  { level: 4, title: "Village Guardian" },
  { level: 5, title: "Cosmic Caretaker" },
];

export const companionAdventures: CompanionAdventure[] = [
  {
    id: "menstruation-cozy-caravan",
    phase: "menstruation",
    title: "Cozy Caravan",
    description: "Snuggle into a heated caravan delivering warm packs across Flatland.",
    durationMinutes: 45,
    reward: { currency: "comfort", amount: 18 },
    inspiration:
      "Finch adventure postcards plus Animal Crossing delivery errands for neighbors in need.",
    successCopy:
      "Comfort crates delivered! Villagers left spiced cocoa on your doorstep and Uteroo's cheeks glow rosy.",
  },
  {
    id: "follicular-study-quest",
    phase: "follicular",
    title: "Spark Study Quest",
    description: "Collect research notes for Sage Moss to unlock a new crafting schematic.",
    durationMinutes: 35,
    reward: { currency: "spark", amount: 16 },
    inspiration: "Habitica knowledge quests with Animal Crossing museum donations.",
    successCopy:
      "The library now shelves your findings! Finch-like encouragement notes flutter in from NPC pen pals.",
  },
  {
    id: "ovulatory-festival-parade",
    phase: "ovulatory",
    title: "Festival Parade",
    description: "Lead the Ovulatory Mountain parade with rhythm taps and community shout-outs.",
    durationMinutes: 30,
    reward: { currency: "vibe", amount: 20 },
    inspiration: "Animal Crossing Fireworks Show meets Finch celebration adventures.",
    successCopy:
      "Parade complete! The plaza sparkles with new emotes and Uteroo gifts you a Vibe confetti popper.",
  },
  {
    id: "luteal-nest-mender",
    phase: "luteal",
    title: "Nest Mender",
    description: "Restore lanterns and pillows in the Nest lounge to prep for cozy season.",
    durationMinutes: 40,
    reward: { currency: "soothe", amount: 17 },
    inspiration: "Animal Crossing house decorating fused with Finch's homebody adventures.",
    successCopy:
      "The Nest glows with warm light. Uteroo hums a lullaby and hands you a Lavender Pillow cosmetic!",
  },
];

export const levelThreshold = 100;

export const getBondTitle = (level: number) => {
  const sorted = [...bondTitles].sort((a, b) => b.level - a.level);
  for (const entry of sorted) {
    if (level >= entry.level) {
      return entry.title;
    }
  }
  return bondTitles[0]?.title ?? "New Nest Ally";
};

export const getOutfitById = (id: string) => outfitCatalog.find((outfit) => outfit.id === id);

export const availableOutfitsForLevel = (level: number) =>
  outfitCatalog.filter((outfit) => level >= outfit.unlockLevel);

export const adventuresForPhase = (phase: PhaseId) =>
  companionAdventures.filter((adventure) => adventure.phase === phase);

export const getAdventureById = (id: string) =>
  companionAdventures.find((adventure) => adventure.id === id);
