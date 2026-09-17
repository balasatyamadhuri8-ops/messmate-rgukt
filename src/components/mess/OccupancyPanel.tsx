import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { crowdLevel, crowdTone, occupancyStats, type Thresholds } from "@/lib/mess";
import { cn } from "@/lib/utils";

export function CrowdBadge({ inside, thresholds }: { inside: number; thresholds: Thresholds }) {
  const level = crowdLevel(inside, thresholds);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium",
        crowdTone(level),
      )}
    >
      {level === "Very Low" ? "Very Low / No Queue" : level}
    </span>
  );
}

export function SeatAvailabilityCard({
  inside,
  totalSeats,
  thresholds,
}: {
  inside: number;
  totalSeats: number;
  thresholds: Thresholds;
}) {
  const stats = occupancyStats(inside, totalSeats);
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Seat availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-4xl font-semibold tracking-tight">{stats.percent}%</span>
          <span className="text-sm text-muted-foreground">
            {stats.available} / {stats.totalSeats} seats available
          </span>
        </div>
        <Progress value={stats.percent} className="h-3" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{stats.inside} people currently inside</span>
          <CrowdBadge inside={stats.inside} thresholds={thresholds} />
        </div>
      </CardContent>
    </Card>
  );
}
