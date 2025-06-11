
import { useState, useEffect } from "react";
import { SachetItem, SachetState } from "@/types/sachet";

export const useSachet = () => {
  const [sachetState, setSachetState] = useState<SachetState>({
    isOpen: false,
    activeCategory: null,
    items: [],
    unlockedItems: []
  });

  const openSachet = () => {
    setSachetState(prev => ({ ...prev, isOpen: true }));
  };

  const closeSachet = () => {
    setSachetState(prev => ({ ...prev, isOpen: false }));
  };

  const unlockItem = (itemId: string) => {
    setSachetState(prev => ({
      ...prev,
      unlockedItems: [...prev.unlockedItems, itemId]
    }));
  };

  const useItem = (itemId: string) => {
    console.log(`Using item: ${itemId}`);
    // This can be expanded to track usage, apply effects, etc.
  };

  return {
    sachetState,
    openSachet,
    closeSachet,
    unlockItem,
    useItem
  };
};
