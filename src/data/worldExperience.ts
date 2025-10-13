import { PhaseId, currencyLabels } from "@/data/phaseExperience";

export interface VillageMoment {
  id: string;
  title: string;
  description: string;
  timeWindow: string;
  activityType: "ritual" | "social" | "collection" | "festival";
  rewardHint: string;
  inspiration: string;
}

export interface VillageVisitor {
  id: string;
  name: string;
  role: string;
  highlight: string;
  arrivalWindow: string;
  giftHint: string;
}

export interface CollectionSpotlight {
  id: string;
  name: string;
  description: string;
  rewardHint: string;
  completionTip: string;
}

export const villageMoments: Record<PhaseId, VillageMoment[]> = {
  menstruation: [
    {
      id: "sunrise-steam-lounge",
      title: "Sunrise Steam Lounge",
      description:
        "Open the hotspring doors before noon to earn double Comfort for every guest you welcome.",
      timeWindow: "6:00–12:00",
      activityType: "ritual",
      rewardHint: `Comfort currency bonus + wellness postcards for your Finch-style journal`,
      inspiration: "Animal Crossing morning aerobics meets Finch's gentle morning check-ins.",
    },
    {
      id: "cocoa-circle",
      title: "Cocoa Circle",
      description:
        "Host a slow cocoa circle with three villagers to unlock a group breathing emote.",
      timeWindow: "18:00–21:00",
      activityType: "social",
      rewardHint: "Earn the Cozy Chorus emote + Comfort currency",
      inspiration: "Animal Crossing evening gatherings blended with Finch encouragement circles.",
    },
    {
      id: "blanket-barter",
      title: "Blanket Barter",
      description:
        "Trade extra quilts with Nurse Luna for a limited Warm Pack decor item.",
      timeWindow: "All day",
      activityType: "collection",
      rewardHint: "Unlock Warm Pack decor + catalog entry",
      inspiration: "Animal Crossing trading posts and Habitica loot streaks.",
    },
  ],
  follicular: [
    {
      id: "learning-lab",
      title: "Learning Lab Pop-Up",
      description:
        "Complete two curiosity quests before sunset to invite a Finch-style reflection with Uteroo.",
      timeWindow: "10:00–19:00",
      activityType: "ritual",
      rewardHint: "Spark currency streak boost",
      inspiration: "Animal Crossing museum classes with Finch's growth journaling.",
    },
    {
      id: "research-regatta",
      title: "Research Regatta",
      description:
        "Sail tiny boats on the Meadow River to collect data orbs for Sage Moss.",
      timeWindow: "14:00–17:00",
      activityType: "collection",
      rewardHint: "Unlock a new crafting schematic + Spark",
      inspiration: "Pokémon GO exploration energy with Animal Crossing fishing tourneys.",
    },
    {
      id: "planning-picnic",
      title: "Planning Picnic",
      description:
        "Host a picnic planning session to queue upcoming rituals and decorate the vision board.",
      timeWindow: "All day",
      activityType: "social",
      rewardHint: "Group planning badge + Spark",
      inspiration: "Fabulous journey-style planning with Animal Crossing campsite meetups.",
    },
  ],
  ovulatory: [
    {
      id: "festival-fireworks",
      title: "Festival Fireworks Show",
      description:
        "Coordinate fireworks bursts with rhythm taps to shower the plaza in Vibe confetti.",
      timeWindow: "20:00–23:00",
      activityType: "festival",
      rewardHint: "Triple Vibe payout + exclusive emote",
      inspiration: "Animal Crossing fireworks festival with Finch's celebration adventures.",
    },
    {
      id: "friendship-parade",
      title: "Friendship Parade",
      description:
        "March with visiting NPCs to deliver affirmation letters across the mountain ridge.",
      timeWindow: "16:00–18:00",
      activityType: "social",
      rewardHint: "Unlock pen pal mail + Vibe",
      inspiration: "Animal Crossing villager parades and SuperBetter ally boosts.",
    },
    {
      id: "market-flash",
      title: "Market Flash Quest",
      description:
        "Collect rare festival ingredients to restock Chef Nori's pop-up kitchen.",
      timeWindow: "09:00–13:00",
      activityType: "collection",
      rewardHint: "Kitchen decor unlock + Vibe",
      inspiration: "Animal Crossing Nook's Cranny rush with StepBet-style urgency.",
    },
  ],
  luteal: [
    {
      id: "lantern-lit-library",
      title: "Lantern-Lit Library",
      description:
        "Light lanterns in the Nest library to trigger a guided calm meditation session.",
      timeWindow: "19:00–22:00",
      activityType: "ritual",
      rewardHint: "Soothe currency + guided audio",
      inspiration: "Fabulous evening rituals with Animal Crossing twilight ambience.",
    },
    {
      id: "declutter-derby",
      title: "Declutter Derby",
      description:
        "Sort three cozy corners before midnight for a Forest-style focus tree reward.",
      timeWindow: "All day",
      activityType: "collection",
      rewardHint: "Earn Flora focus tree badge + Soothe",
      inspiration: "Forest/Flora focus timers woven into Animal Crossing house chores.",
    },
    {
      id: "comfort-coach-council",
      title: "Comfort Coach Council",
      description:
        "Meet with Sage Moss and Coach Pip to customize your rest schedule for the week.",
      timeWindow: "08:00–11:00",
      activityType: "social",
      rewardHint: "Schedule blueprint + Soothe",
      inspiration: "Done's calendar mastery meets Animal Crossing resident services.",
    },
  ],
};

export const villageVisitors: Record<PhaseId, VillageVisitor[]> = {
  menstruation: [
    {
      id: "nurse-luna",
      name: "Nurse Luna",
      role: "Cycle Care Nurse",
      highlight: "Trades warm packs for herbal ingredients and checks on your energy",
      arrivalWindow: "Daily 07:00",
      giftHint: `Bring loose lavender bundles to earn extra ${currencyLabels.comfort}`,
    },
    {
      id: "ember-twins",
      name: "Ember Twins",
      role: "Fireplace Keepers",
      highlight: "Run the hearth lounge and unlock cuddle animations",
      arrivalWindow: "Every other evening",
      giftHint: "Deliver fresh firewood for bonus Comfort",
    },
  ],
  follicular: [
    {
      id: "sage-moss",
      name: "Sage Moss",
      role: "Research Guide",
      highlight: "Curates curiosity quests and library expansions",
      arrivalWindow: "Weekdays 09:00",
      giftHint: `Share study notes for Spark multipliers`,
    },
    {
      id: "coach-pip",
      name: "Coach Pip",
      role: "Movement Mentor",
      highlight: "Leads light cardio quests with Habitica-style party boosts",
      arrivalWindow: "Every afternoon",
      giftHint: "Complete two movement streaks for bonus Spark",
    },
  ],
  ovulatory: [
    {
      id: "chef-nori",
      name: "Chef Nori",
      role: "Festival Chef",
      highlight: "Runs pop-up kitchens and social tasting events",
      arrivalWindow: "Festival days",
      giftHint: `Deliver seasonal produce for extra ${currencyLabels.vibe}`,
    },
    {
      id: "dj-lyra",
      name: "DJ Lyra",
      role: "Rhythm Host",
      highlight: "Spins collaborative playlists and dance-offs",
      arrivalWindow: "Nights 19:00",
      giftHint: "Share a mood playlist for Vibe bonus",
    },
  ],
  luteal: [
    {
      id: "sage-moss",
      name: "Sage Moss",
      role: "Mindful Mentor",
      highlight: "Offers breathwork and reflection prompts",
      arrivalWindow: "Mornings",
      giftHint: `Bring journaling pages for ${currencyLabels.soothe} boosts`,
    },
    {
      id: "auntie-marigold",
      name: "Auntie Marigold",
      role: "Nest Keeper",
      highlight: "Shares declutter tips and cozy recipes",
      arrivalWindow: "Weekends",
      giftHint: "Gift dried herbs for Soothe bonus",
    },
  ],
};

export const collectionSpotlights: Record<PhaseId, CollectionSpotlight[]> = {
  menstruation: [
    {
      id: "warm-pack-series",
      name: "Warm Pack Series",
      description: "Gather plush warm packs crafted by different villagers.",
      rewardHint: "Complete the set to unlock the Hearth Sofa",
      completionTip: "Trade duplicate packs with visiting friends like Flora players do.",
    },
    {
      id: "comfort-soundscapes",
      name: "Comfort Soundscapes",
      description: "Collect ambient tracks recorded around Flatland.",
      rewardHint: "Unlock lullaby playlist + Comfort",
      completionTip: "Record during Sunrise Steam Lounge for rare tracks.",
    },
  ],
  follicular: [
    {
      id: "spark-seed-vault",
      name: "Spark Seed Vault",
      description: "Gather seeds that boost curiosity gardens.",
      rewardHint: "Unlock research greenhouse",
      completionTip: "Complete Research Regatta to earn rare seeds.",
    },
    {
      id: "learning-badges",
      name: "Learning Badges",
      description: "Earn badges for every new skill practiced this phase.",
      rewardHint: "Badge sash decor + Spark",
      completionTip: "Chain check-ins with Finch-style reflections to double progress.",
    },
  ],
  ovulatory: [
    {
      id: "festival-poster-set",
      name: "Festival Poster Set",
      description: "Collect posters from visiting artists during festival week.",
      rewardHint: "Decor wall upgrade + Vibe",
      completionTip: "Trade duplicates with DJ Lyra during evening sessions.",
    },
    {
      id: "friendship-bracelets",
      name: "Friendship Bracelets",
      description: "Weave bracelets with villagers you parade alongside.",
      rewardHint: "Unlock Social Hub expansion",
      completionTip: "Complete Finch-style excited check-ins before the parade for bonus threads.",
    },
  ],
  luteal: [
    {
      id: "soothe-tea-library",
      name: "Soothe Tea Library",
      description: "Blend teas that calm the nervous system.",
      rewardHint: "Tea ceremony emote + Soothe",
      completionTip: "Invite Auntie Marigold for recipe swaps.",
    },
    {
      id: "nest-nook-charms",
      name: "Nest Nook Charms",
      description: "Curate small charms that radiate cozy protection.",
      rewardHint: "Unlock Nest storage upgrade",
      completionTip: "Complete Declutter Derby streaks to reveal hidden charms.",
    },
  ],
};
