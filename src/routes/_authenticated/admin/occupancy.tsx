import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/mess/PageHeader";
import { StatCard } from "@/components/mess/StatCard";
import { StatusBadge } from "@/components/mess/StatusBadge";
import { CrowdBadge, SeatAvailabilityCard } from "@/components/mess/OccupancyPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInsideCount, useInsideStudents, useSettings } from "@/lib/data";
import { occupancyStats } from "@/lib/mess";

export const Route = createFileRoute("/_authenticated/admin/occupancy")({
  component: Occupancy,
});

function Occupancy() {
  const settings = useSettings();
  const inside = useInsideCount();
  const students = useInsideStudents();

  if (!settings.data || inside.isLoading) return <Skeleton className="h-64 w-full" />;
  const stats = occupancyStats(inside.data ?? 0, settings.data.total_seats);

  return (
    <div>
      <PageHeader title="Occupancy" description="Who is currently inside the mess." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="People Inside" value={stats.inside} icon={<Users className="size-5" />} />
        <StatCard label="Total Seats" value={stats.totalSeats} />
        <StatCard label="Available Seats" value={stats.available} />
        <StatCard
          label="Crowd Level"
          value={<CrowdBadge inside={stats.inside} thresholds={settings.data} />}
        />
      </div>

      <div className="mt-4">
        <SeatAvailabilityCard
          inside={stats.inside}
          totalSeats={stats.totalSeats}
          thresholds={settings.data}
        />
      </div>

      <Card className="mt-6 border-border/70 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Students currently inside</CardTitle>
        </CardHeader>
        <CardContent>
          {students.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (students.data?.length ?? 0) === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No students are currently inside the mess.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Time entered</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.data!.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.profiles?.full_name ?? "—"}</TableCell>
                      <TableCell>{s.profiles?.student_id ?? "—"}</TableCell>
                      <TableCell>
                        {s.entered_at ? new Date(s.entered_at).toLocaleTimeString() : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.current_status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
