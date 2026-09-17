import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/mess/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin/profile")({
  component: AdminProfile,
});

function AdminProfile() {
  const { profile } = useAuth();
  if (!profile) return <Skeleton className="h-40 w-full" />;

  return (
    <div>
      <PageHeader title="Profile" description="Your mess staff account details." />
      <Card className="max-w-lg border-border/70 shadow-sm">
        <CardContent className="space-y-3 p-6 text-sm">
          <Row label="Name" value={profile.full_name} />
          <Row label="Email" value={profile.email} />
          <Row label="Role" value="Admin / Staff" />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
