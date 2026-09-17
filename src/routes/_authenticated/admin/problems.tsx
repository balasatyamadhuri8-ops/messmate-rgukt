import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/mess/PageHeader";
import { ProblemImage } from "@/components/mess/ProblemImage";
import { StatusBadge } from "@/components/mess/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAllProblems } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { PROBLEM_STATUSES } from "@/lib/mess";

export const Route = createFileRoute("/_authenticated/admin/problems")({
  component: AdminProblems,
});

function AdminProblems() {
  const problems = useAllProblems();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    try {
      const { error } = await supabase
        .from("problems")
        .update({
          status: status as (typeof PROBLEM_STATUSES)[number],
          updated_at: new Date().toISOString(),
          updated_by: profile?.id ?? null,
        })
        .eq("id", id);
      if (error) {
        toast.error("Unable to update the status. Please try again.");
        return;
      }
      toast.success(`Status updated to ${status}.`);
      await queryClient.invalidateQueries({ queryKey: ["all-problems"] });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Reported Problems"
        description="Review student reports and update their status."
      />
      {problems.isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (problems.data?.length ?? 0) === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No reported problems yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {problems.data!.map((p) => (
            <Card key={p.id} className="border-border/70 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row">
                {p.image_url ? <ProblemImage path={p.image_url} alt={p.title} /> : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold">{p.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {p.category} · {p.profiles?.full_name ?? "Unknown"} (
                        {p.profiles?.student_id ?? "—"})
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{p.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Select
                      value={p.status}
                      onValueChange={(v) => updateStatus(p.id, v)}
                      disabled={savingId === p.id}
                    >
                      <SelectTrigger className="w-48" aria-label="Update status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROBLEM_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">
                      {savingId === p.id ? "Updating status..." : null}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Report ID {p.id.slice(0, 8).toUpperCase()} ·{" "}
                    {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
