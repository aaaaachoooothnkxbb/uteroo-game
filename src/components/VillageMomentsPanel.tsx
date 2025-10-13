import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CalendarDays, MapPin, Package, Users } from "lucide-react";
import { PhaseId } from "@/data/phaseExperience";
import {
  collectionSpotlights,
  villageMoments,
  villageVisitors,
} from "@/data/worldExperience";

interface VillageMomentsPanelProps {
  phase: PhaseId;
  dayInPhase: number;
}

export const VillageMomentsPanel = ({ phase, dayInPhase }: VillageMomentsPanelProps) => {
  const todaysMoment = useMemo(() => {
    const list = villageMoments[phase] ?? [];
    if (list.length === 0) return null;
    const index = Math.max(0, (dayInPhase - 1) % list.length);
    return list[index];
  }, [phase, dayInPhase]);

  const spotlightVisitor = useMemo(() => {
    const visitors = villageVisitors[phase] ?? [];
    if (visitors.length === 0) return null;
    const index = Math.max(0, (dayInPhase - 1) % visitors.length);
    return visitors[index];
  }, [phase, dayInPhase]);

  const collection = useMemo(() => {
    const collections = collectionSpotlights[phase] ?? [];
    if (collections.length === 0) return null;
    const index = Math.max(0, (dayInPhase - 1) % collections.length);
    return collections[index];
  }, [phase, dayInPhase]);

  const handlePinMoment = () => {
    if (!todaysMoment) return;
    toast("Village moment pinned", {
      description: `${todaysMoment.title} added to your ritual tracker.`,
      icon: "📌",
    });
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="h-5 w-5 text-emerald-500" /> Village happenings
        </CardTitle>
        <CardDescription>
          Animal Crossing-inspired real-time events keep the world breathing with you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {todaysMoment ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-900">{todaysMoment.title}</p>
                <p className="text-sm text-emerald-900/70">{todaysMoment.description}</p>
                <p className="mt-2 text-xs text-emerald-900/60">{todaysMoment.inspiration}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="text-xs text-emerald-900">
                  {todaysMoment.timeWindow}
                </Badge>
                <Badge variant="secondary" className="text-xs uppercase">
                  {todaysMoment.activityType}
                </Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-emerald-900/70">
              <Package className="h-3 w-3" />
              <span>{todaysMoment.rewardHint}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={handlePinMoment}>
                Pin to rituals
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast("Shareable postcard", {
                    description: "A Finch-style adventure postcard ready to send to friends.",
                    icon: "💌",
                  })
                }
              >
                Send postcard
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No scheduled moment — wander freely today.</p>
        )}

        <Separator className="bg-slate-100" />

        <div className="grid gap-4 md:grid-cols-2">
          {spotlightVisitor ? (
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-900">
                  <Users className="h-4 w-4" />
                  <p className="text-sm font-semibold">Visitor spotlight</p>
                </div>
                <Badge variant="outline" className="text-xs text-slate-600">
                  {spotlightVisitor.arrivalWindow}
                </Badge>
              </div>
              <p className="mt-2 text-base font-semibold text-slate-900">{spotlightVisitor.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{spotlightVisitor.role}</p>
              <p className="mt-2 text-sm text-slate-600">{spotlightVisitor.highlight}</p>
              <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="h-3 w-3" /> {spotlightVisitor.giftHint}
              </p>
            </div>
          ) : null}

          {collection ? (
            <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-violet-900">
                  <Package className="h-4 w-4" />
                  <p className="text-sm font-semibold">Collection spotlight</p>
                </div>
                <Badge variant="outline" className="text-xs text-violet-900">
                  Reward
                </Badge>
              </div>
              <p className="mt-2 text-base font-semibold text-violet-900">{collection.name}</p>
              <p className="text-sm text-violet-900/70">{collection.description}</p>
              <p className="mt-2 text-xs text-violet-900/80">{collection.rewardHint}</p>
              <p className="mt-3 text-xs text-violet-900/70">{collection.completionTip}</p>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
