import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  CurrencyId,
  PhaseId,
  LifeStageId,
  moodBuckets,
  phaseSequence,
  defaultLifeStageId,
  resolvePhaseExperience,
  lifeStageConfigs,
  ResolvedPhaseExperienceConfig,
} from "@/data/phaseExperience";

const HEALTH_SLOTS = 4;
const currencyOrder: CurrencyId[] = ["comfort", "spark", "vibe", "soothe"];

const defaultFlags = { poorSleep: false, stress: false } as const;
type DailyFlags = typeof defaultFlags;

const isBrowser = typeof window !== "undefined";

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const healthKey = (stage: LifeStageId, phase: PhaseId) => `uteroo-health-${stage}-${phase}`;
const needsKey = (stage: LifeStageId, phase: PhaseId, dayKey: string) =>
  `uteroo-needs-${stage}-${phase}-${dayKey}`;
const flagsKey = (stage: LifeStageId, dayKey: string) => `uteroo-flags-${stage}-${dayKey}`;
const currenciesKey = "uteroo-currencies";
const bonusKey = (stage: LifeStageId, phase: PhaseId) => `uteroo-bonus-${stage}-${phase}`;
const streakKey = (stage: LifeStageId) => `uteroo-care-streak-${stage}`;
const lastPerfectKey = (stage: LifeStageId) => `uteroo-last-perfect-day-${stage}`;

const readJson = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse storage key ${key}`, error);
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const createResourceState = (
  initial?: Partial<Record<CurrencyId, number>>
): Record<CurrencyId, number> => {
  const base: Record<CurrencyId, number> = {
    comfort: 0,
    spark: 0,
    vibe: 0,
    soothe: 0,
  };

  if (initial) {
    for (const currency of currencyOrder) {
      const value = initial[currency];
      if (typeof value === "number" && !Number.isNaN(value)) {
        base[currency] = Math.max(0, Math.round(value));
      }
    }
  }

  return base;
};

const computeDayInPhase = (
  phase: PhaseId,
  cycleDay: number,
  cycleLength: number,
  lifeStageId: LifeStageId
) => {
  const normalizedDay = ((cycleDay - 1) % cycleLength + cycleLength) % cycleLength + 1;
  let runningTotal = 0;

  for (const id of phaseSequence) {
    const config = resolvePhaseExperience(id, lifeStageId);
    const start = runningTotal + 1;
    const end = runningTotal + config.duration;

    if (normalizedDay >= start && normalizedDay <= end) {
      return { dayInPhase: normalizedDay - runningTotal, totalDays: config.duration };
    }

    runningTotal = end;
  }

  const fallbackTotal = resolvePhaseExperience(phase, lifeStageId).duration;
  return { dayInPhase: clamp(normalizedDay, 1, fallbackTotal), totalDays: fallbackTotal };
};

export interface MoodState {
  bucket: -2 | -1 | 0 | 1 | 2;
  label: "low" | "meh" | "ok" | "bright" | "radiant";
  emoji: string;
  message: string;
  progress: number;
  breakdown: {
    hormone: number;
    careBonus: number;
    penalties: number;
    raw: number;
    explanation: string;
  };
}

export interface CompleteNeedResult {
  alreadyCompleted: boolean;
  reward?: {
    currency: CurrencyId;
    amount: number;
  };
  newHealth: number;
  unlockedBonus: boolean;
  perfectDay: boolean;
}

export interface PhaseBonusReward {
  currency: CurrencyId;
  amount: number;
}

export const usePhaseExperience = (
  phase: PhaseId,
  cycleDay: number,
  cycleLength: number,
  lifeStageId: LifeStageId = defaultLifeStageId
) => {
  const stageConfig = lifeStageConfigs[lifeStageId] ?? lifeStageConfigs[defaultLifeStageId];
  const resolvedConfig = useMemo<ResolvedPhaseExperienceConfig>(
    () => resolvePhaseExperience(phase, lifeStageId),
    [phase, lifeStageId]
  );
  const [dailyKey, setDailyKey] = useState(getLocalDateKey);
  const [health, setHealth] = useState(() => readJson<number>(healthKey(lifeStageId, phase), 0));
  const [completedNeeds, setCompletedNeeds] = useState<Set<string>>(
    () => new Set(readJson<string[]>(needsKey(lifeStageId, phase, getLocalDateKey()), []))
  );
  const [resources, setResources] = useState(() =>
    createResourceState(readJson<Partial<Record<CurrencyId, number>>>(currenciesKey, {}))
  );
  const [phaseBonusClaimed, setPhaseBonusClaimed] = useState(() =>
    readJson<boolean>(bonusKey(lifeStageId, phase), false)
  );
  const [careStreak, setCareStreak] = useState(() => readJson<number>(streakKey(lifeStageId), 0));
  const [lastPerfectDate, setLastPerfectDate] = useState<string | null>(() =>
    readJson<string | null>(lastPerfectKey(lifeStageId), null)
  );
  const [dailyFlags, setDailyFlagsState] = useState<DailyFlags>(() => ({
    ...defaultFlags,
    ...readJson<Partial<DailyFlags>>(flagsKey(lifeStageId, getLocalDateKey()), {}),
  }));

  const previousPhaseRef = useRef<PhaseId | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const key = getLocalDateKey();
      setDailyKey((prev) => (prev === key ? prev : key));
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (previousPhaseRef.current === null) {
      previousPhaseRef.current = phase;
      return;
    }

    if (previousPhaseRef.current !== phase) {
      previousPhaseRef.current = phase;
      setHealth(0);
      writeJson(healthKey(lifeStageId, phase), 0);
      setCompletedNeeds(new Set());
      writeJson(needsKey(lifeStageId, phase, getLocalDateKey()), []);
      setPhaseBonusClaimed(false);
      writeJson(bonusKey(lifeStageId, phase), false);
      setDailyFlagsState(defaultFlags);
      writeJson(flagsKey(lifeStageId, getLocalDateKey()), defaultFlags);
    } else {
      const stored = readJson<number>(healthKey(lifeStageId, phase), 0);
      setHealth(stored);
    }
  }, [phase, lifeStageId]);

  useEffect(() => {
    const storedNeeds = readJson<string[]>(needsKey(lifeStageId, phase, dailyKey), []);
    setCompletedNeeds(new Set(storedNeeds));

    const storedFlags = readJson<Partial<DailyFlags>>(flagsKey(lifeStageId, dailyKey), {});
    setDailyFlagsState({ ...defaultFlags, ...storedFlags });
  }, [phase, dailyKey, lifeStageId]);

  useEffect(() => {
    writeJson(healthKey(lifeStageId, phase), health);
  }, [phase, health, lifeStageId]);

  useEffect(() => {
    writeJson(needsKey(lifeStageId, phase, dailyKey), Array.from(completedNeeds));
  }, [phase, dailyKey, completedNeeds, lifeStageId]);

  useEffect(() => {
    writeJson(currenciesKey, resources);
  }, [resources]);

  useEffect(() => {
    writeJson(bonusKey(lifeStageId, phase), phaseBonusClaimed);
  }, [phase, phaseBonusClaimed, lifeStageId]);

  useEffect(() => {
    writeJson(flagsKey(lifeStageId, dailyKey), dailyFlags);
  }, [dailyKey, dailyFlags, lifeStageId]);

  useEffect(() => {
    writeJson(streakKey(lifeStageId), careStreak);
  }, [careStreak, lifeStageId]);

  useEffect(() => {
    writeJson(lastPerfectKey(lifeStageId), lastPerfectDate);
  }, [lastPerfectDate, lifeStageId]);

  useEffect(() => {
    if (!lastPerfectDate) return;
    const diff = differenceInCalendarDays(parseISO(dailyKey), parseISO(lastPerfectDate));
    if (diff > 1 && careStreak !== 0) {
      setCareStreak(0);
    }
  }, [dailyKey, lastPerfectDate, careStreak]);

  const { dayInPhase, totalDays } = useMemo(
    () => computeDayInPhase(phase, cycleDay, cycleLength, lifeStageId),
    [phase, cycleDay, cycleLength, lifeStageId]
  );

  const mood = useMemo<MoodState>(() => {
    const index = clamp(dayInPhase - 1, 0, totalDays - 1);
    const hormones = resolvedConfig.hormoneProfile;
    const estrogen = hormones.estrogen[index] ?? hormones.estrogen[hormones.estrogen.length - 1] ?? 0;
    const progesterone =
      hormones.progesterone[index] ?? hormones.progesterone[hormones.progesterone.length - 1] ?? 0;
    const lh = hormones.lh[index] ?? hormones.lh[hormones.lh.length - 1] ?? 0;
    const fsh = hormones.fsh[index] ?? hormones.fsh[hormones.fsh.length - 1] ?? 0;

    const hormoneScore = 0.6 * estrogen - 0.4 * progesterone + 0.2 * lh + 0.1 * fsh;
    const careBonus = clamp(health * 0.3 + careStreak * 0.05, 0, 1);
    const penalties = (dailyFlags.poorSleep ? 0.3 : 0) + (dailyFlags.stress ? 0.2 : 0);
    const raw = hormoneScore + careBonus - penalties;
    const bucketValue = clamp(Math.round(raw * 2 - 1), -2, 2) as -2 | -1 | 0 | 1 | 2;
    const bucketMeta = moodBuckets[bucketValue];
    const progress = ((bucketValue + 2) / 4) * 100;

    const explanation = `E2 ${estrogen.toFixed(2)} · P4 ${progesterone.toFixed(2)} · LH ${lh.toFixed(2)} · FSH ${fsh.toFixed(2)} + care ${careBonus.toFixed(2)} − penalties ${penalties.toFixed(2)}`;

    return {
      bucket: bucketValue,
      label: bucketMeta.label,
      emoji: bucketMeta.emoji,
      message: bucketMeta.message,
      progress,
      breakdown: {
        hormone: hormoneScore,
        careBonus,
        penalties,
        raw,
        explanation,
      },
    };
  }, [resolvedConfig.hormoneProfile, dayInPhase, totalDays, health, careStreak, dailyFlags]);

  const phaseProgress = clamp((totalDays ? dayInPhase / totalDays : 0) * 100, 0, 100);

  const setDailyFlag = (flag: keyof DailyFlags, value: boolean) => {
    setDailyFlagsState((prev) => {
      if (prev[flag] === value) return prev;
      return { ...prev, [flag]: value };
    });
  };

  const grantCareReward = useCallback(
    (currency: CurrencyId, amount: number) => {
      if (!amount) return null;

      let nextState: Record<CurrencyId, number> | null = null;
      setResources((prev) => {
        const nextValue = Math.max(0, (prev[currency] ?? 0) + amount);
        nextState = { ...prev, [currency]: nextValue };
        return nextState;
      });

      if (nextState) {
        writeJson(currenciesKey, nextState);
      }

      return { currency, amount };
    },
    []
  );

  const completeNeed = (needId: string): CompleteNeedResult | null => {
    const need = resolvedConfig.needs.find((item) => item.id === needId);
    if (!need) return null;

    if (completedNeeds.has(needId)) {
      return {
        alreadyCompleted: true,
        reward: need.reward,
        newHealth: health,
        unlockedBonus: false,
        perfectDay: completedNeeds.size === resolvedConfig.needs.length,
      };
    }

    const newSet = new Set(completedNeeds);
    newSet.add(needId);
    setCompletedNeeds(newSet);
    writeJson(needsKey(lifeStageId, phase, dailyKey), Array.from(newSet));

    const willBePerfect = newSet.size === resolvedConfig.needs.length;
    const wasFull = health >= HEALTH_SLOTS;
    let updatedHealth = health;

    setHealth((prev) => {
      const next = clamp(prev + need.hpValue, 0, HEALTH_SLOTS);
      updatedHealth = next;
      writeJson(healthKey(lifeStageId, phase), next);
      return next;
    });

    grantCareReward(need.reward.currency, need.reward.amount);

    if (willBePerfect) {
      const diff = lastPerfectDate
        ? differenceInCalendarDays(parseISO(dailyKey), parseISO(lastPerfectDate))
        : null;

      if (diff !== 0) {
        setCareStreak((prev) => {
          const next = diff === 1 || diff === null ? prev + 1 : 1;
          writeJson(streakKey(lifeStageId), next);
          return next;
        });
        if (diff === null || diff >= 1) {
          setLastPerfectDate(dailyKey);
          writeJson(lastPerfectKey(lifeStageId), dailyKey);
        }
      }
    }

    const unlockedBonus = !wasFull && updatedHealth >= HEALTH_SLOTS && !phaseBonusClaimed;

    return {
      alreadyCompleted: false,
      reward: need.reward,
      newHealth: updatedHealth,
      unlockedBonus,
      perfectDay: willBePerfect,
    };
  };

  const claimPhaseBonus = (): PhaseBonusReward | null => {
    if (phaseBonusClaimed || health < HEALTH_SLOTS) {
      return null;
    }

    const reward: PhaseBonusReward = { currency: resolvedConfig.currency, amount: 50 };
    setPhaseBonusClaimed(true);
    writeJson(bonusKey(lifeStageId, phase), true);

    grantCareReward(reward.currency, reward.amount);

    return reward;
  };

  return {
    config: resolvedConfig,
    stageConfig,
    lifeStageId,
    stageSpecificNeeds: resolvedConfig.stageSpecificNeeds ?? [],
    dayInPhase,
    totalDaysInPhase: totalDays,
    phaseProgress,
    health,
    maxHealth: HEALTH_SLOTS,
    completedNeeds,
    resources,
    careStreak,
    dailyFlags,
    mood,
    phaseBonusReady: health >= HEALTH_SLOTS && !phaseBonusClaimed,
    phaseBonusClaimed,
    completeNeed,
    claimPhaseBonus,
    grantCareReward,
    setDailyFlag,
  };
};

export type UsePhaseExperienceReturn = ReturnType<typeof usePhaseExperience>;
