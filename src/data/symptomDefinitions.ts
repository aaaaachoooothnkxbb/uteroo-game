
export interface SymptomDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const symptomScreens: SymptomDefinition[][] = [
  // Screen 1: Sleep and Temperature Regulation
  [
    {
      id: 'hot_flashes',
      name: 'Hot Flashes',
      description: 'Sudden feelings of warmth, often intense, with sweating and reddening of the face and neck.',
      emoji: '🔥'
    },
    {
      id: 'night_sweats',
      name: 'Night Sweats',
      description: 'Hot flashes that occur during sleep, leading to excessive sweating and disrupted sleep.',
      emoji: '💧'
    },
    {
      id: 'insomnia',
      name: 'Insomnia/Difficulty Sleeping',
      description: 'Trouble falling asleep, staying asleep, or waking up too early.',
      emoji: '😴'
    }
  ],
  // Screen 2: Sleep Quality and Mood
  [
    {
      id: 'restless_sleep',
      name: 'Restless Sleep',
      description: 'Frequent awakenings or poor quality sleep even without night sweats.',
      emoji: '🌙'
    },
    {
      id: 'mood_swings',
      name: 'Mood Swings/Irritability',
      description: 'Rapid shifts in mood, increased irritability, or feelings of being easily annoyed.',
      emoji: '🎭'
    },
    {
      id: 'anxiety',
      name: 'Anxiety/Nervousness',
      description: 'Feelings of worry, unease, or panic.',
      emoji: '😰'
    }
  ],
  // Screen 3: Mental and Intimate Health
  [
    {
      id: 'depressed_mood',
      name: 'Depressed Mood/Sadness',
      description: 'Persistent feelings of sadness, hopelessness, or loss of interest in activities.',
      emoji: '😢'
    },
    {
      id: 'brain_fog',
      name: 'Difficulty Concentrating/Brain Fog',
      description: 'Problems with focus, memory, or mental clarity.',
      emoji: '🧠'
    },
    {
      id: 'vaginal_dryness',
      name: 'Vaginal Dryness',
      description: 'Discomfort, itching, or pain during intercourse due to lack of vaginal lubrication.',
      emoji: '🌸'
    }
  ],
  // Screen 4: Physical and Urinary Health
  [
    {
      id: 'painful_intercourse',
      name: 'Painful Intercourse',
      description: 'Discomfort or pain during sexual activity.',
      emoji: '💔'
    },
    {
      id: 'urinary_urgency',
      name: 'Urinary Urgency/Frequency',
      description: 'A sudden, strong need to urinate, or urinating more often than usual.',
      emoji: '🚻'
    },
    {
      id: 'joint_pain',
      name: 'Joint Pain/Stiffness',
      description: 'Aches or stiffness in joints throughout the body.',
      emoji: '🦴'
    }
  ],
  // Screen 5: Physical Changes and Energy
  [
    {
      id: 'hair_thinning',
      name: 'Hair Thinning/Loss',
      description: 'Noticeable reduction in hair density or increased hair shedding.',
      emoji: '💇‍♀️'
    },
    {
      id: 'weight_gain',
      name: 'Weight Gain',
      description: 'An increase in weight, particularly in the midsection, despite no significant changes in diet or activity.',
      emoji: '⚖️'
    },
    {
      id: 'fatigue',
      name: 'Fatigue/Low Energy',
      description: 'Persistent feelings of tiredness or lack of energy.',
      emoji: '😴'
    }
  ]
];

export const getAllSymptomIds = (): string[] => {
  return symptomScreens.flat().map(symptom => symptom.id);
};
