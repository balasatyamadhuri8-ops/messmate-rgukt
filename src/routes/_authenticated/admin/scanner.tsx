import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/mess/PageHeader";
import { StatusBadge } from "@/components/mess/StatusBadge";
import { CrowdBadge } from "@/components/mess/OccupancyPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsideCount, useSettings } from "@/lib/data";
import { occupancyStats } from "@/lib/mess";
import { findStudentByQr, markAttendance, type ScannedStudent } from "@/lib/occupancy";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin/scanner")({
  component: Scanner,
});

const REGION_ID = "mess-qr-reader";

function Scanner() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const settings = useSettings();
  const inside = useInsideCount();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const busyRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [student, setStudent] = useState<ScannedStudent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      const instance = scannerRef.current;
      if (instance) {
        instance
          .stop()
          .catch(() => undefined)
          .finally(() => instance.clear());
      }
    };
  }, []);

  async function handleDecoded(text: string) {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const found = await findStudentByQr(text);
      if (!found) {
        toast.error("Invalid or unregistered student QR code.");
        return;
      }
      setStudent(found);
      await stopCamera();
    } finally {
      setTimeout(() => {
        busyRef.current = false;
      }, 1200);
    }
  }

  async function startCamera() {
    if (scanning || starting) return;
    setStarting(true);
    setPermissionError(null);
    try {
      const instance = scannerRef.current ?? new Html5Qrcode(REGION_ID);
      scannerRef.current = instance;
      await instance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decoded) => {
          void handleDecoded(decoded);
        },
        () => undefined,
      );
      setScanning(true);
    } catch {
      setPermissionError(
        "Camera permission is required to scan student QR codes. Allow camera access in your browser settings and try again.",
      );
    } finally {
      setStarting(false);
    }
  }

  async function stopCamera() {
    const instance = scannerRef.current;
    if (!instance) return;
    try {
      await instance.stop();
    } catch {
      /* already stopped */
    }
    setScanning(false);
  }

  async function mark(action: "IN" | "OUT") {
    if (!student || !profile || saving) return;
    setSaving(true);
    try {
      const result = await markAttendance(student, action, {
        id: profile.id,
        name: profile.full_name,
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setStudent({ ...student, status: action });
      await queryClient.invalidateQueries({ queryKey: ["inside-count"] });
      await queryClient.invalidateQueries({ queryKey: ["inside-students"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } finally {
      setSaving(false);
    }
  }

  const stats = occupancyStats(inside.data ?? 0, settings.data?.total_seats ?? 100);

  return (
    <div>
      <PageHeader
        title="QR Scanner"
        description="Scan a student's mess QR code, then confirm IN or OUT to record the transaction."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Camera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              id={REGION_ID}
              className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted"
            />
            {!scanning ? (
              <p className="text-center text-sm text-muted-foreground">
                Camera is off. Start the camera to scan a QR code.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="flex-1 gap-2" onClick={startCamera} disabled={scanning || starting}>
                <Camera className="size-5" /> {starting ? "Starting..." : "Start camera"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                onClick={stopCamera}
                disabled={!scanning}
              >
                <CameraOff className="size-5" /> Stop camera
              </Button>
            </div>
            {permissionError ? (
              <Alert variant="destructive">
                <AlertTitle>Camera unavailable</AlertTitle>
                <AlertDescription>{permissionError}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Scan result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!student ? (
                <p className="text-sm text-muted-foreground">
                  No student scanned yet. Point the camera at a student QR code.
                </p>
              ) : (
                <>
                  <dl className="space-y-2 text-sm">
                    <Row label="Student name" value={student.full_name} />
                    <Row label="Student ID" value={student.student_id ?? "—"} />
                    <Row label="Email" value={student.email} />
                    <Row label="QR identity" value={student.qr_code} mono />
                    <div className="flex items-center justify-between pt-1">
                      <dt className="text-muted-foreground">Current status</dt>
                      <dd>
                        <StatusBadge status={student.status} />
                      </dd>
                    </div>
                  </dl>
                  <p className="text-sm text-muted-foreground">
                    {student.status === "IN"
                      ? "Student is already inside the mess."
                      : "Student is currently outside the mess."}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      size="lg"
                      className="h-16 text-lg"
                      disabled={saving || student.status === "IN"}
                      onClick={() => mark("IN")}
                    >
                      {saving ? "Saving..." : "IN"}
                    </Button>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="h-16 text-lg"
                      disabled={saving || student.status === "OUT"}
                      onClick={() => mark("OUT")}
                    >
                      {saving ? "Saving..." : "OUT"}
                    </Button>
                  </div>
                  <Button variant="ghost" className="w-full" onClick={() => setStudent(null)}>
                    Clear and scan next student
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Live mess status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <Metric label="People inside" value={String(stats.inside)} />
              <Metric label="Available seats" value={`${stats.available} / ${stats.totalSeats}`} />
              <Metric label="Seat availability" value={`${stats.percent}%`} />
              <div>
                <p className="text-muted-foreground">Queue level</p>
                {settings.data ? (
                  <CrowdBadge inside={stats.inside} thresholds={settings.data} />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "break-all font-mono text-xs" : "font-medium"}>{value}</dd>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
