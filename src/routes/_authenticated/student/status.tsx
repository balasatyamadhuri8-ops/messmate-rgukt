import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/mess/PageHeader";
import { StatCard } from "@/components/mess/StatCard";
import { CrowdBadge, SeatAvailabilityCard } from "@/components/mess/OccupancyPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsideCount, useMenu, useSettings } from "@/lib/data";
import { currentMealPeriod, occupancyStats, todayName } from "@/lib/mess";

export const Route = createFileRoute("/_authenticated/student/status")({
  component: MessStatus,
});

function MessStatus() {
  const settings = useSettings();
  const inside = useInsideCount();
  const menu = useMenu();

  if (!settings.data || inside.isLoading) return <Skeleton className="h-64 w-full" />;

  const stats = occupancyStats(inside.data ?? 0, settings.data.total_seats);
  const day = todayName();
  const meal = currentMealPeriod(settings.data);
  const todaysMeal = menu.data?.find((m) => m.day === day && m.meal_period === meal);

  return (
    <div>
      <PageHeader
        title="Mess Status"
        description="Live occupancy and crowd information for the college mess."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="People Inside" value={stats.inside} icon={<Users className="size-5" />} />
        <StatCard label="Available Seats" value={stats.available} hint={`of ${stats.totalSeats} seats`} />
        <StatCard label="Total Seats" value={stats.totalSeats} />
        <StatCard label="Seat Availability" value={`${stats.percent}%`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SeatAvailabilityCard
          inside={stats.inside}
          totalSeats={stats.totalSeats}
          thresholds={settings.data}
        />
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {meal ? `Current meal — ${meal}` : "Meal period"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{day}</span>
              <CrowdBadge inside={stats.inside} thresholds={settings.data} />
            </div>
            {meal && todaysMeal ? (
              <ul className="space-y-1.5">
                {todaysMeal.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No active meal period right now.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
