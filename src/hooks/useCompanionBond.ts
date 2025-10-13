import { useCallback, useEffect, useMemo, useState } from "react";
import { addMinutes, isBefore } from "date-fns";
import {
  adventuresForPhase,
  availableOutfitsForLevel,
  CheckInFeeling,
  feelingConfigs,
  getAdventureById,
  getBondTitle,
  maxDailyCheckIns,
  levelThreshold,
} from "@/data/companionBond";
import { CurrencyId, PhaseId } from "@/data/phaseExperience";

const bondKey = "uteroo-companion-bond-v1";

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface BondHistoryEntry {
  date: string;
  feeling: CheckInFeeling;
  reflection: string;
}

interface AdventureLogEntry {
  id: string;
  completedAt: string;
}

interface ActiveAdventureState {
  id: string;
  startedAt: string;
  durationMinutes: number;
}

interface BondState {
  level: number;
  xp: number;
  energy: number;
  lastEnergyReset: string;
  outfitId: string;
  unlockedOutfits: string[];
  history: BondHistoryEntry[];
  activeAdventure?: ActiveAdventureState;
  adventureLog: AdventureLogEntry[];
  lastFeeling?: CheckInFeeling;
}

const defaultBondState: BondState = {
  level: 1,
  xp: 0,
  energy: maxDailyCheckIns,
  lastEnergyReset: getTodayKey(),
  outfitId: "aurora-wrap",
  unlockedOutfits: ["aurora-wrap"],
  history: [],
  adventureLog: [],
};

const readBondState = (): BondState => {
  if (typeof window === "undefined") return defaultBondState;
  const raw = window.localStorage.getItem(bondKey);
  if (!raw) return defaultBondState;
  try {
    const parsed = JSON.parse(raw) as BondState;
    return {
      ...defaultBondState,
      ...parsed,
      unlockedOutfits: Array.from(new Set(["aurora-wrap", ...(parsed.unlockedOutfits ?? [])])),
    };
  } catch (error) {
    console.warn("Failed to parse companion bond state", error);
    return defaultBondState;
  }
};

const persistBondState = (state: BondState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(bondKey, JSON.stringify(state));
};

export interface LogCheckInResult {
  success: boolean;
  reason?: "noEnergy" | "invalidFeeling";
  xpEarned?: number;
  levelUp?: boolean;
  newLevel?: number;
  response?: string;
  reward?: { currency: CurrencyId; amount: number };
  unlockedOutfits?: string[];
  energyLeft?: number;
}

export interface StartAdventureResult {
  success: boolean;
  reason?: "activeAdventure" | "unknownAdventure";
  adventureId?: string;
  readyAt?: Date;
}

export interface ClaimAdventureResult {
  success: boolean;
  reason?: "noAdventure" | "notReady";
  adventureId?: string;
  readyAt?: Date;
  reward?: { currency: CurrencyId; amount: number };
  successCopy?: string;
}

export const useCompanionBond = (phase: PhaseId) => {
  const [bond, setBond] = useState<BondState>(() => readBondState());
  const [todayKey, setTodayKey] = useState(getTodayKey);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const key = getTodayKey();
      setTodayKey((prev) => (prev === key ? prev : key));
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setBond((prev) => {
      if (prev.lastEnergyReset === todayKey) return prev;
      const next = { ...prev, energy: maxDailyCheckIns, lastEnergyReset: todayKey };
      persistBondState(next);
      return next;
    });
  }, [todayKey]);

  useEffect(() => {
    persistBondState(bond);
  }, [bond]);

  const bondTitle = useMemo(() => getBondTitle(bond.level), [bond.level]);
  const xpProgress = useMemo(() => (bond.xp / levelThreshold) * 100, [bond.xp]);
  const availableOutfits = useMemo(
    () => availableOutfitsForLevel(bond.level),
    [bond.level]
  );

  const feelingOptions = useMemo(() => Object.values(feelingConfigs), []);

  const availableAdventures = useMemo(
    () => adventuresForPhase(phase),
    [phase]
  );

  const logCheckIn = useCallback(
    (feeling: CheckInFeeling, reflection: string): LogCheckInResult => {
      const feelingConfig = feelingConfigs[feeling];
      if (!feelingConfig) {
        return { success: false, reason: "invalidFeeling" };
      }

      const currentDay = getTodayKey();
      let prevented = false;
      let levelUp = false;
      let newLevel = 0;
      let unlocked: string[] = [];
      let energyLeft = 0;

      setBond((prev) => {
        if (prev.energy <= 0) {
          prevented = true;
          return prev;
        }

        const xpTotal = prev.xp + feelingConfig.xp;
        newLevel = prev.level;
        let xpRemainder = xpTotal;
        while (xpRemainder >= levelThreshold) {
          xpRemainder -= levelThreshold;
          newLevel += 1;
          levelUp = true;
        }

        const available = availableOutfitsForLevel(newLevel).map((outfit) => outfit.id);
        unlocked = available.filter((id) => !prev.unlockedOutfits.includes(id));
        energyLeft = Math.max(prev.energy - 1, 0);

        const historyEntry: BondHistoryEntry = {
          date: currentDay,
          feeling,
          reflection,
        };

        const history = [historyEntry, ...prev.history].slice(0, 12);
        const unlockedOutfits = Array.from(
          new Set([...prev.unlockedOutfits, ...available])
        );

        const nextState: BondState = {
          ...prev,
          level: newLevel,
          xp: xpRemainder,
          energy: energyLeft,
          lastEnergyReset: currentDay,
          lastFeeling: feeling,
          history,
          unlockedOutfits,
        };

        return nextState;
      });

      if (prevented) {
        return { success: false, reason: "noEnergy" };
      }

      return {
        success: true,
        xpEarned: feelingConfig.xp,
        levelUp,
        newLevel,
        response: feelingConfig.response,
        reward: feelingConfig.reward,
        unlockedOutfits: unlocked,
        energyLeft,
      };
    },
    []
  );

  const startAdventure = useCallback(
    (adventureId: string): StartAdventureResult => {
      const adventure = getAdventureById(adventureId);
      if (!adventure) {
        return { success: false, reason: "unknownAdventure" };
      }

      let blocked = false;
      const startedAt = new Date().toISOString();

      setBond((prev) => {
        if (prev.activeAdventure) {
          blocked = true;
          return prev;
        }

        const next: BondState = {
          ...prev,
          activeAdventure: {
            id: adventure.id,
            startedAt,
            durationMinutes: adventure.durationMinutes,
          },
        };
        return next;
      });

      if (blocked) {
        return { success: false, reason: "activeAdventure" };
      }

      const readyAt = addMinutes(new Date(startedAt), adventure.durationMinutes);
      return { success: true, adventureId: adventure.id, readyAt };
    },
    []
  );

  const claimAdventureReward = useCallback((): ClaimAdventureResult => {
    const active = bond.activeAdventure;
    if (!active) {
      return { success: false, reason: "noAdventure" };
    }

    const adventure = getAdventureById(active.id);
    if (!adventure) {
      return { success: false, reason: "noAdventure" };
    }

    const startedAt = new Date(active.startedAt);
    const readyAt = addMinutes(startedAt, active.durationMinutes);
    if (isBefore(new Date(), readyAt)) {
      return { success: false, reason: "notReady", adventureId: adventure.id, readyAt };
    }

    const completedAt = new Date().toISOString();

    setBond((prev) => {
      const nextLog = [
        { id: adventure.id, completedAt },
        ...prev.adventureLog,
      ].slice(0, 10);

      const next: BondState = {
        ...prev,
        activeAdventure: undefined,
        adventureLog: nextLog,
      };
      return next;
    });

    return {
      success: true,
      adventureId: adventure.id,
      reward: adventure.reward,
      readyAt,
      successCopy: adventure.successCopy,
    };
  }, [bond.activeAdventure]);

  return {
    bond,
    bondTitle,
    xpProgress,
    availableOutfits,
    feelingOptions,
    availableAdventures,
    checkInsRemaining: bond.energy,
    history: bond.history,
    activeAdventure: bond.activeAdventure,
    adventureLog: bond.adventureLog,
    logCheckIn,
    startAdventure,
    claimAdventureReward,
  };
};
