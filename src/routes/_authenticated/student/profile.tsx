import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode } from "lucide-react";
import { PageHeader } from "@/components/mess/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/student/profile")({
  component: StudentProfile,
});

function StudentProfile() {
  const { profile } = useAuth();
  if (!profile) return <Skeleton className="h-48 w-full" />;

  return (
    <div>
      <PageHeader title="Profile" description="Your student account details." />
      <Card className="max-w-lg border-border/70 shadow-sm">
        <CardContent className="space-y-3 p-6 text-sm">
          <Row label="Name" value={profile.full_name} />
          <Row label="Student ID" value={profile.student_id ?? "—"} />
          <Row label="Email" value={profile.email} />
          <Row label="Role" value="Student" />
          <Button asChild variant="outline" className="mt-2 gap-2">
            <Link to="/student/qr">
              <QrCode className="size-4" /> View My QR Code
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
