import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  CurrencyId,
  PhaseId,
  LifeStageId,
  currencyEmojis,
  currencyLabels,
} from "@/data/phaseExperience";
import { usePhaseExperience } from "@/hooks/usePhaseExperience";
import { CompanionBondPanel } from "./CompanionBondPanel";
import { VillageMomentsPanel } from "./VillageMomentsPanel";
import {
  CalendarHeart,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Heart,
  Sparkles,
  Waves,
} from "lucide-react";
import { toast } from "sonner";

const currencyOrder: CurrencyId[] = ["comfort", "spark", "vibe", "soothe"];

const moodIndicatorMap = {
  low: "bg-rose-500",
  meh: "bg-amber-400",
  ok: "bg-sky-400",
  bright: "bg-emerald-500",
  radiant: "bg-violet-500",
};

type DailyFlagKey = "poorSleep" | "stress";

type PhaseExperiencePanelProps = {
  phase: PhaseId;
  cycleDay: number;
  cycleLength: number;
  lifeStageId: LifeStageId;
};

export const PhaseExperiencePanel = ({
  phase,
  cycleDay,
  cycleLength,
  lifeStageId,
}: PhaseExperiencePanelProps) => {
  const {
    config,
    stageConfig,
    stageSpecificNeeds,
    dayInPhase,
    totalDaysInPhase,
    phaseProgress,
    health,
    maxHealth,
    completedNeeds,
    resources,
    careStreak,
    dailyFlags,
    mood,
    phaseBonusReady,
    phaseBonusClaimed,
    completeNeed,
    claimPhaseBonus,
    setDailyFlag,
    grantCareReward,
  } = usePhaseExperience(phase, cycleDay, cycleLength, lifeStageId);

  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const timeDisplay = useMemo(() => format(clock, "h:mm a"), [clock]);
  const dateDisplay = useMemo(() => format(clock, "EEEE, MMM d"), [clock]);
  const daysRemaining = Math.max(totalDaysInPhase - dayInPhase, 0);
  const healthMessage = health >= maxHealth
    ? "Health bar full—celebrate with Uteroo!"
    : `${maxHealth - health} HP until the next celebration.`;

  const handleNeedComplete = (needId: string) => {
    const completion = completeNeed(needId);
    if (!completion) return;

    const need = config.needs.find((item) => item.id === needId);
    if (!need) return;

    if (completion.alreadyCompleted) {
      toast("Already checked", {
        description: "This ritual is shining green for today. Circle back tomorrow!",
      });
      return;
    }

    toast(`${need.title} complete`, {
      description: `${need.encouragement} +${need.reward.amount} ${currencyLabels[need.reward.currency]}.`,
      icon: "💖",
    });

    if (completion.perfectDay) {
      toast("Daily rituals complete", {
        description: "Your care streak just received a glow-up!",
        icon: "🔥",
      });
    }

    if (completion.unlockedBonus) {
      toast("Health bar glowing", {
        description: "Hit Celebrate to unlock the phase bonus and video moment.",
        icon: "🎬",
      });
    }
  };

  const handleBonusClaim = () => {
    const reward = claimPhaseBonus();
    if (!reward) {
      toast("Bonus already shared", {
        description: "Keep nurturing daily rituals to maintain the glow.",
        icon: "🌟",
      });
      return;
    }

    toast("Phase bonus unlocked", {
      description: `+${reward.amount} ${currencyLabels[reward.currency]} for caring through ${config.displayName}.`,
      icon: "💫",
    });
  };

  const handleFlagToggle = (flag: DailyFlagKey) => {
    const nextValue = !dailyFlags[flag];
    setDailyFlag(flag, nextValue);

    if (flag === "poorSleep") {
      toast(nextValue ? "Noted: rough sleep" : "Rested sleep logged", {
        description: nextValue
          ? "We'll gently lower mood projections until you rebound."
          : "Sweet dreams! Mood boost restored.",
        icon: nextValue ? "😴" : "🌙",
      });
    } else {
      toast(nextValue ? "Stressful vibe logged" : "Calm day logged", {
        description: nextValue
          ? "We'll cushion today’s tasks with extra softness."
          : "Love that grounded energy—keep it flowing!",
        icon: nextValue ? "⚡" : "🧘",
      });
    }
  };

  const handleMiniGamePreview = () => {
    toast(`${config.miniGame.name} (coming soon)`, {
      description: `${config.miniGame.rewardPreview}. The kiosk unlocks in the next sprint!`,
      icon: "🕹️",
    });
  };

  return (
    <div className="space-y-4 pb-6">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border p-6 ring-1",
          "bg-gradient-to-r",
          config.accentGradient,
          config.accentTextClass,
          config.accentRing
        )}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  "px-3 py-1 text-xs font-semibold shadow-sm",
                  stageConfig.highlightClass
                )}
              >
                {stageConfig.heroEmoji} {stageConfig.displayName} • Ages {stageConfig.ageRange}
              </Badge>
            </div>
            <Badge className="uppercase tracking-wide bg-white/70 text-xs text-foreground">
              {config.displayName}
            </Badge>
            <h2 className="text-3xl font-semibold flex items-center gap-2">
              {config.heroEmoji} {config.tagline}
            </h2>
            <p className="max-w-xl text-sm md:text-base opacity-80">
              Day {dayInPhase} of {totalDaysInPhase} • Cycle day {cycleDay}
            </p>
          </div>
          <div className="space-y-2 text-sm md:text-right">
            <div className="flex items-center gap-2 md:justify-end text-base font-semibold">
              <Clock className="h-4 w-4" />
              <span>{timeDisplay}</span>
            </div>
            <p className="opacity-90">{dateDisplay}</p>
            <Progress
              value={phaseProgress}
              indicatorClassName="bg-rose-500/90"
              className="h-2 bg-white/50"
            />
            <p className="text-xs opacity-80">
              {daysRemaining === 0
                ? "Phase change arrives with the next sunrise."
                : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} until the next phase portal.`}
            </p>
          </div>
        </div>
      </div>

      <Card className="backdrop-blur-sm bg-white/90">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-rose-500" /> Life stage spotlight
          </CardTitle>
          <CardDescription>{stageConfig.summary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {stageConfig.stageFocus.map((focus) => (
              <span
                key={focus}
                className="rounded-full bg-rose-100/60 px-3 py-1 text-xs font-semibold text-rose-900"
              >
                {focus}
              </span>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-rose-200/80 bg-rose-50/70 p-4">
            <p className="text-sm font-semibold text-rose-900">Supportive practices</p>
            <ul className="mt-2 space-y-2 text-sm text-rose-900/80">
              {stageConfig.supportivePractices.map((practice) => (
                <li key={practice} className="flex items-start gap-2">
                  <span className="mt-1 text-rose-500">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <CompanionBondPanel phase={phase} onReward={grantCareReward} />
        <VillageMomentsPanel phase={phase} dayInPhase={dayInPhase} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-rose-500" /> Moodometer
            </CardTitle>
            <CardDescription>{mood.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold capitalize">{mood.label}</span>
              <span className="text-muted-foreground">
                {mood.breakdown.explanation}
              </span>
            </div>
            <Progress
              value={mood.progress}
              indicatorClassName={moodIndicatorMap[mood.label]}
              className="h-2"
            />
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Care bonus: +{mood.breakdown.careBonus.toFixed(2)}</p>
              <p>Hormone curve score: {mood.breakdown.hormone.toFixed(2)}</p>
              {mood.breakdown.penalties > 0 ? (
                <p className="text-rose-500">Penalties: −{mood.breakdown.penalties.toFixed(2)}</p>
              ) : (
                <p className="text-emerald-500">No penalties today—glow on!</p>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Daily context</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={dailyFlags.poorSleep ? "default" : "outline"}
                  onClick={() => handleFlagToggle("poorSleep")}
                  className={cn(
                    dailyFlags.poorSleep
                      ? "bg-rose-500 hover:bg-rose-600"
                      : "border-rose-200"
                  )}
                >
                  {dailyFlags.poorSleep ? "😴 Poor sleep" : "🌙 Rested sleep"}
                </Button>
                <Button
                  size="sm"
                  variant={dailyFlags.stress ? "default" : "outline"}
                  onClick={() => handleFlagToggle("stress")}
                  className={cn(
                    dailyFlags.stress
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "border-amber-200"
                  )}
                >
                  {dailyFlags.stress ? "⚡ Stressful day" : "🧘 Calm vibe"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/95">
          <CardHeader>
            <CardTitle className="text-lg uppercase tracking-wide">
              {config.ritualsHeadline}
            </CardTitle>
            <CardDescription>{healthMessage}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {Array.from({ length: maxHealth }).map((_, index) => {
                    const filled = index < health;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border text-lg transition",
                          filled
                            ? "border-emerald-400 bg-emerald-100 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-300"
                        )}
                      >
                        {filled ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Badge variant="outline" className="w-fit text-xs uppercase tracking-wide">
                HP {health}/{maxHealth}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {config.needs.map((need) => {
                const completed = completedNeeds.has(need.id);
                return (
                  <div
                    key={need.id}
                    className={cn(
                      "rounded-2xl border p-4 transition",
                      completed
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="font-semibold text-base">{need.title}</p>
                        <p className="text-sm text-muted-foreground">{need.description}</p>
                      </div>
                      {completed ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <Button size="sm" onClick={() => handleNeedComplete(need.id)}>
                          Do it now
                        </Button>
                      )}
                    </div>
                    <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-dashed">
                          +{need.reward.amount} {currencyLabels[need.reward.currency]}
                        </Badge>
                        <span>{need.encouragement}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {stageSpecificNeeds.length > 0 && (
              <div className="rounded-2xl border border-dashed border-rose-200/70 bg-rose-50/60 p-4">
                <p className="text-sm font-semibold text-rose-900">Life stage spotlight rituals</p>
                <div className="mt-3 space-y-3">
                  {stageSpecificNeeds.map((spotlight) => (
                    <div key={spotlight.id} className="space-y-1">
                      <p className="text-sm font-semibold text-rose-900">{spotlight.title}</p>
                      <p className="text-sm text-rose-900/80">{spotlight.description}</p>
                      <p className="text-xs font-medium text-emerald-600">{spotlight.rewardHint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phaseBonusReady && (
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-amber-900 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  <div>
                    <p className="font-semibold text-base">Health bar glowing!</p>
                    <p className="text-sm">
                      Press celebrate to play uterus-better.mp4 and unlock the phase bonus.
                    </p>
                  </div>
                </div>
                <Button onClick={handleBonusClaim} className="bg-amber-500 text-amber-950 hover:bg-amber-600">
                  Celebrate with Uteroo
                </Button>
              </div>
            )}

            {phaseBonusClaimed && !phaseBonusReady && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <span>Phase bonus claimed—keep the rituals flowing for lasting glow.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="h-5 w-5 text-orange-500" /> Cycle resources
            </CardTitle>
            <CardDescription>
              Earned currencies fuel decor, recipes, and ritual upgrades.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {currencyOrder.map((currency) => (
                <div
                  key={currency}
                  className={cn(
                    "rounded-2xl border p-3",
                    currency === config.currency
                      ? "border-primary bg-primary/10"
                      : "border-slate-200"
                  )}
                >
                  <p className="text-sm font-medium flex items-center gap-2">
                    <span>{currencyEmojis[currency]}</span>
                    {currencyLabels[currency]}
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {resources[currency] ?? 0}
                  </p>
                  {currency === config.currency && (
                    <p className="text-xs text-muted-foreground">
                      Featured this phase
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>
                Care streak: <span className="font-semibold text-foreground">{careStreak}</span> day
                {careStreak === 1 ? "" : "s"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Waves className="h-5 w-5 text-sky-500" /> {config.miniGame.name}
            </CardTitle>
            <CardDescription>{config.miniGame.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50/70 p-3 text-sky-900">
              {config.miniGame.sceneHint}
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <Sparkles className="h-4 w-4" />
              <span>{config.miniGame.rewardPreview}</span>
            </div>
            <Button variant="outline" onClick={handleMiniGamePreview}>
              Visit the Games Kiosk
            </Button>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarHeart className="h-5 w-5 text-rose-500" /> Cycle coaching
            </CardTitle>
            <CardDescription>
              Gentle education tailored to {config.displayName}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {config.supportiveCopy.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
