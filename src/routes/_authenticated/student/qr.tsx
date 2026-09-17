import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { PageHeader } from "@/components/mess/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/student/qr")({
  component: MyQr,
});

function MyQr() {
  const { profile } = useAuth();

  if (!profile) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <PageHeader
        title="My QR Code"
        description="Show this code to the mess staff at the entry desk. Only staff can mark you IN or OUT."
      />
      <Card className="mx-auto max-w-md border-border/70 shadow-sm">
        <CardContent className="flex flex-col items-center gap-5 p-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <QRCodeSVG value={profile.qr_code} size={220} level="M" />
          </div>
          <dl className="w-full space-y-2 text-sm">
            <Row label="Student Name" value={profile.full_name} />
            <Row label="Student ID" value={profile.student_id ?? "—"} />
            <Row label="Email" value={profile.email} />
            <Row label="QR Identity" value={profile.qr_code} mono />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "break-all font-mono text-xs" : "font-medium"}>{value}</dd>
    </div>
  );
}
