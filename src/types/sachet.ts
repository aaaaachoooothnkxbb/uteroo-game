
export interface SachetItem {
  id: string;
  name: string;
  description: string;
  category: 'symptom-slayer' | 'phase-power-up' | 'general-wellness';
  icon: string;
  isHighlighted?: boolean;
  isAvailable: boolean;
  effectText?: string;
  phases?: string[]; // Which cycle phases this item is most relevant for
}

export interface SachetCategory {
  id: string;
  name: string;
  description: string;
  items: SachetItem[];
  color: string;
}

export interface SachetState {
  isOpen: boolean;
  activeCategory: string | null;
  items: SachetItem[];
  unlockedItems: string[];
}
