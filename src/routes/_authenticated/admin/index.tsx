import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, RotateCcw, ScanLine, UtensilsCrossed, Users } from "lucide-react";
import { PageHeader } from "@/components/mess/PageHeader";
import { StatCard } from "@/components/mess/StatCard";
import { CrowdBadge } from "@/components/mess/OccupancyPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllProblems, useInsideCount, useSettings } from "@/lib/data";
import { occupancyStats } from "@/lib/mess";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const settings = useSettings();
  const inside = useInsideCount();
  const problems = useAllProblems();

  if (!settings.data || inside.isLoading) return <Skeleton className="h-64 w-full" />;

  const stats = occupancyStats(inside.data ?? 0, settings.data.total_seats);
  const count = (status: string) => problems.data?.filter((p) => p.status === status).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Live mess occupancy and reported problem overview."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="People Inside" value={stats.inside} icon={<Users className="size-5" />} />
        <StatCard label="Available Seats" value={`${stats.available} / ${stats.totalSeats}`} />
        <StatCard label="Seat Availability" value={`${stats.percent}%`} />
        <StatCard
          label="Current Crowd"
          value={<CrowdBadge inside={stats.inside} thresholds={settings.data} />}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending Problems" value={count("Pending")} />
        <StatCard label="In Progress" value={count("In Progress")} />
        <StatCard label="Resolved" value={count("Resolved")} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Quick actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Button asChild size="lg" className="h-20 justify-start gap-3 text-base sm:col-span-2 lg:col-span-3">
          <Link to="/admin/scanner">
            <ScanLine className="size-6" /> SCAN STUDENT QR
          </Link>
        </Button>
        <Action to="/admin/occupancy" icon={<Users className="size-5" />} label="View Occupancy" />
        <Action to="/admin/problems" icon={<AlertCircle className="size-5" />} label="View Problems" />
        <Action to="/admin/menu" icon={<UtensilsCrossed className="size-5" />} label="Manage Menu" />
        <Action to="/admin/reset" icon={<RotateCcw className="size-5" />} label="Reset Mess" />
      </div>
    </div>
  );
}

function Action({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Button asChild variant="outline" className="h-14 justify-start gap-3">
      <Link to={to}>
        <span className="text-primary">{icon}</span>
        {label}
      </Link>
    </Button>
  );
}
