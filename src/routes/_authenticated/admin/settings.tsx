import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/mess/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: MessSettings,
});

const NUMBER_FIELDS = [
  ["total_seats", "Total seats"],
  ["very_low_max", "Very Low crowd up to"],
  ["low_max", "Low crowd up to"],
  ["medium_max", "Medium crowd up to"],
  ["high_max", "High crowd up to"],
] as const;

const TIME_FIELDS = [
  ["breakfast_start", "Breakfast start"],
  ["breakfast_end", "Breakfast end"],
  ["lunch_start", "Lunch start"],
  ["lunch_end", "Lunch end"],
  ["snacks_start", "Snacks start"],
  ["snacks_end", "Snacks end"],
  ["dinner_start", "Dinner start"],
  ["dinner_end", "Dinner end"],
] as const;

function MessSettings() {
  const settings = useSettings();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings.data) return;
    const next: Record<string, string> = {};
    for (const [key] of NUMBER_FIELDS) next[key] = String(settings.data[key]);
    for (const [key] of TIME_FIELDS) next[key] = String(settings.data[key]).slice(0, 5);
    setForm(next);
  }, [settings.data]);

  if (settings.isLoading || !settings.data) return <Skeleton className="h-64 w-full" />;

  async function save() {
    const seats = Number(form['total_seats']);
    if (!Number.isInteger(seats) || seats < 1) {
      toast.error("Total seats must be a whole number of at least 1.");
      return;
    }
    const thresholds = ["very_low_max", "low_max", "medium_max", "high_max"].map((k) =>
      Number(form[k]),
    );
    if (thresholds.some((n) => !Number.isFinite(n) || n < 0)) {
      toast.error("Crowd thresholds must be valid percentages or counts.");
      return;
    }
    for (let i = 1; i < thresholds.length; i += 1) {
      if (thresholds[i]! <= thresholds[i - 1]!) {
        toast.error("Each crowd threshold must be higher than the previous one.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        updated_at: new Date().toISOString(),
        updated_by: profile?.id ?? null,
      };
      for (const [key] of NUMBER_FIELDS) payload[key] = Number(form[key]);
      for (const [key] of TIME_FIELDS) payload[key] = form[key];
      const { error } = await supabase
        .from("mess_settings")
        .update(payload as never)
        .eq("id", settings.data!.id);
      if (error) {
        toast.error("Unable to save settings. Please try again.");
        return;
      }
      toast.success("Settings saved.");
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Mess Settings"
        description="Configure seat capacity, crowd thresholds and meal timings."
      />
      <div className="grid max-w-4xl gap-4 md:grid-cols-2">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Capacity & crowd levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {NUMBER_FIELDS.map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type="number"
                  min={0}
                  value={form[key] ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Meal timings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {TIME_FIELDS.map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type="time"
                  value={form[key] ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Button className="mt-4" size="lg" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save settings"}
      </Button>
    </div>
  );
}
