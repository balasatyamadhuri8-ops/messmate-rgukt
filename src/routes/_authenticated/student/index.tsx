import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, CalendarDays, QrCode, Users } from "lucide-react";
import { PageHeader } from "@/components/mess/PageHeader";
import { StatCard } from "@/components/mess/StatCard";
import { CrowdBadge, SeatAvailabilityCard } from "@/components/mess/OccupancyPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsideCount, useSettings } from "@/lib/data";
import { occupancyStats } from "@/lib/mess";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/student/")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { profile } = useAuth();
  const settings = useSettings();
  const inside = useInsideCount();

  if (settings.isLoading || inside.isLoading || !settings.data) {
    return <Skeleton className="h-64 w-full" />;
  }

  const stats = occupancyStats(inside.data ?? 0, settings.data.total_seats);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile?.full_name ?? "Student"}`}
        description="Here is the current mess status at RGUKT Srikakulam."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="People Inside"
          value={stats.inside}
          hint="Currently inside the mess"
          icon={<Users className="size-5" />}
        />
        <StatCard
          label="Available Seats"
          value={`${stats.available} / ${stats.totalSeats}`}
          hint={`${stats.percent}% available`}
        />
        <StatCard
          label="Current Crowd"
          value={<CrowdBadge inside={stats.inside} thresholds={settings.data} />}
          hint={`${stats.inside} people currently inside`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SeatAvailabilityCard
          inside={stats.inside}
          totalSeats={stats.totalSeats}
          thresholds={settings.data}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <QuickAction to="/student/report" icon={<AlertCircle className="size-5" />} label="Report a Problem" />
          <QuickAction to="/student/menu" icon={<CalendarDays className="size-5" />} label="View Food Menu" />
          <QuickAction to="/student/status" icon={<Users className="size-5" />} label="View Mess Status" />
          <QuickAction to="/student/qr" icon={<QrCode className="size-5" />} label="View My QR" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Button
      asChild
      variant="outline"
      className="h-auto flex-col items-start gap-2 whitespace-normal p-4 text-left"
    >
      <Link to={to}>
        <span className="text-primary">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </Button>
  );
}
