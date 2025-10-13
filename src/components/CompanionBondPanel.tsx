import { useMemo, useState } from "react";
import { addMinutes, formatDistanceToNowStrict } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { HeartHandshake, Sparkles, Timer } from "lucide-react";
import { useCompanionBond } from "@/hooks/useCompanionBond";
import { CurrencyId, PhaseId, currencyEmojis, currencyLabels } from "@/data/phaseExperience";
import { feelingConfigs, getBondTitle } from "@/data/companionBond";

interface CompanionBondPanelProps {
  phase: PhaseId;
  onReward?: (currency: CurrencyId, amount: number) => void;
}

export const CompanionBondPanel = ({ phase, onReward }: CompanionBondPanelProps) => {
  const {
    bond,
    bondTitle,
    xpProgress,
    availableOutfits,
    feelingOptions,
    availableAdventures,
    checkInsRemaining,
    history,
    activeAdventure,
    logCheckIn,
    startAdventure,
    claimAdventureReward,
  } = useCompanionBond(phase);

  const [feeling, setFeeling] = useState(feelingOptions[0]?.id ?? "proud");
  const [reflection, setReflection] = useState("");
  const [selectedAdventure, setSelectedAdventure] = useState<string | null>(null);

  const previewAdventure = useMemo(() => {
    if (activeAdventure) {
      return availableAdventures.find((item) => item.id === activeAdventure.id) ?? null;
    }
    if (selectedAdventure) {
      return availableAdventures.find((item) => item.id === selectedAdventure) ?? null;
    }
    return null;
  }, [activeAdventure, selectedAdventure, availableAdventures]);

  const companionEmoji = useMemo(() => {
    if (bond.level >= 5) return "🪐";
    if (bond.level >= 4) return "🌈";
    if (bond.level >= 3) return "💞";
    if (bond.level >= 2) return "🌸";
    return "🐣";
  }, [bond.level]);

  const handleCheckIn = () => {
    const trimmedReflection = reflection.trim();
    const result = logCheckIn(feeling, trimmedReflection);

    if (!result.success) {
      if (result.reason === "noEnergy") {
        toast("Out of check-ins", {
          description: "You’ve used today’s reflection energy. Try again tomorrow for fresh bond glow!",
          icon: "💤",
        });
      } else {
        toast("Pick a feeling first", {
          description: "Select the emotion that matches your day so Uteroo can respond.",
        });
      }
      return;
    }

    setReflection("");
    toast("Check-in saved", {
      description: result.response,
      icon: "🫶",
    });

    if (result.reward) {
      onReward?.(result.reward.currency, result.reward.amount);
      toast("Bond reward", {
        description: `+${result.reward.amount} ${currencyLabels[result.reward.currency]} from sharing your feelings.`,
        icon: currencyEmojis[result.reward.currency],
      });
    }

    if (result.levelUp && result.newLevel) {
      toast("Bond leveled up!", {
        description: `Uteroo is now level ${result.newLevel}. ${getBondTitle(result.newLevel)} unlocked new hugs.`,
        icon: "🎉",
      });
    }

    if (result.unlockedOutfits && result.unlockedOutfits.length > 0) {
      const newest = result.unlockedOutfits[result.unlockedOutfits.length - 1];
      const outfit = availableOutfits.find((item) => item.id === newest);
      if (outfit) {
        toast("New outfit unlocked", {
          description: `${outfit.name}: ${outfit.description}`,
          icon: "🧵",
        });
      }
    }
  };

  const handleStartAdventure = () => {
    if (!selectedAdventure) {
      toast("Choose an adventure", {
        description: "Pick a Finch-style postcard mission before sending Uteroo off.",
      });
      return;
    }

    const result = startAdventure(selectedAdventure);
    if (!result.success) {
      if (result.reason === "activeAdventure") {
        toast("Adventure already running", {
          description: "Let the current mission finish before starting another one.",
          icon: "⏳",
        });
      } else {
        toast("Adventure not found", {
          description: "Refresh the list and try again.",
        });
      }
      return;
    }

    setSelectedAdventure(null);
    if (result.readyAt) {
      toast("Adventure underway", {
        description: `Check back in ${formatDistanceToNowStrict(result.readyAt, { roundingMethod: "ceil" })}.`,
        icon: "🚀",
      });
    }
  };

  const handleClaimAdventure = () => {
    const result = claimAdventureReward();
    if (!result.success) {
      if (result.reason === "noAdventure") {
        toast("No active adventure", {
          description: "Send Uteroo on a mission first.",
        });
        return;
      }

      if (result.reason === "notReady" && result.readyAt) {
        toast("Adventure still running", {
          description: `Ready in ${formatDistanceToNowStrict(result.readyAt, { roundingMethod: "ceil" })}.`,
          icon: "⏳",
        });
      }
      return;
    }

    if (result.reward) {
      onReward?.(result.reward.currency, result.reward.amount);
      toast("Adventure complete!", {
        description: `${result.successCopy ?? "Uteroo returns glowing."} +${result.reward.amount} ${currencyLabels[result.reward.currency]}.`,
        icon: currencyEmojis[result.reward.currency],
      });
    }
  };

  const activeReadyAt = activeAdventure
    ? addMinutes(new Date(activeAdventure.startedAt), activeAdventure.durationMinutes)
    : null;

  const feelingPrompt = useMemo(
    () => feelingConfigs[feeling]?.prompt ?? "Share your vibe",
    [feeling]
  );

  return (
    <Card className="backdrop-blur-sm bg-white/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartHandshake className="h-5 w-5 text-rose-500" /> Bond with Uteroo
        </CardTitle>
        <CardDescription>
          Emotional check-ins and Finch-style adventures deepen your cozy connection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-rose-100/80 bg-rose-50/70 p-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-rose-900">{bondTitle}</p>
            <p className="text-xs text-rose-900/70">
              Level {bond.level} • {checkInsRemaining} check-in{checkInsRemaining === 1 ? "" : "s"} left today
            </p>
            <Progress value={xpProgress} className="h-2 bg-rose-100" indicatorClassName="bg-rose-500" />
            <p className="text-xs text-rose-900/70">{bond.xp} XP toward the next heart glow</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-rose-200/80 bg-white/80 px-6 py-3 text-4xl">
            <span>{companionEmoji}</span>
            <Badge variant="outline" className="text-xs">
              {availableOutfits.length} outfits unlocked
            </Badge>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Emotional check-in</h3>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <HeartHandshake className="h-3 w-3" /> {checkInsRemaining} left
            </Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-[200px_1fr]">
            <Select value={feeling} onValueChange={(value) => setFeeling(value as typeof feeling)}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Choose feeling" />
              </SelectTrigger>
              <SelectContent>
                {feelingOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder={feelingPrompt}
              className="min-h-[96px]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Uteroo responds like Finch’s supportive bird, logging mood context for the Moodometer.</span>
          </div>
          <Button onClick={handleCheckIn} disabled={checkInsRemaining <= 0}>
            Share with Uteroo
          </Button>
        </div>

        <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-indigo-900">Adventure postcards</h3>
            {activeAdventure ? (
              <Badge variant="outline" className="text-xs flex items-center gap-1 text-indigo-900">
                <Timer className="h-3 w-3" />
                {activeReadyAt
                  ? `${formatDistanceToNowStrict(activeReadyAt, { roundingMethod: "ceil" })} left`
                  : "Wrapping up"}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-indigo-900">
                Inspired by Finch journeys
              </Badge>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-[220px_1fr]">
            <Select
              value={selectedAdventure ?? ""}
              onValueChange={(value) => setSelectedAdventure(value === "" ? null : value)}
              disabled={Boolean(activeAdventure)}
            >
              <SelectTrigger className="bg-white/90">
                <SelectValue placeholder={activeAdventure ? "Adventure running" : "Choose adventure"} />
              </SelectTrigger>
              <SelectContent>
                {availableAdventures.map((adventure) => (
                  <SelectItem key={adventure.id} value={adventure.id}>
                    {adventure.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-2 text-sm text-indigo-900/80">
              {previewAdventure ? (
                <p>{previewAdventure.description}</p>
              ) : (
                <p>Pick a cozy mission to send Uteroo on a postcard-worthy quest.</p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-900/70">
                {previewAdventure?.reward && (
                  <Badge variant="outline" className="border-dashed">
                    +{previewAdventure.reward.amount} {currencyLabels[previewAdventure.reward.currency]}
                  </Badge>
                )}
                <span>
                  {previewAdventure?.inspiration ?? "Animal Crossing errands + Finch postcards = perfect combo."}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleStartAdventure} disabled={Boolean(activeAdventure)} variant="secondary">
              Launch adventure
            </Button>
            <Button onClick={handleClaimAdventure} variant="default" disabled={!activeAdventure}>
              Claim postcard rewards
            </Button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Recent reflections</h3>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Mood history syncs with Cycle Sanctuary
              </Badge>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {history.slice(0, 3).map((entry, index) => (
                <li key={`${entry.date}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{entry.date}</span>
                    <span className="font-semibold text-slate-700">{feelingConfigs[entry.feeling].label}</span>
                  </div>
                  {entry.reflection ? <p className="mt-1 text-slate-700">{entry.reflection}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
