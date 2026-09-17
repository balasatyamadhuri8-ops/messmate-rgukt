import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/mess/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useInsideCount } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin/reset")({
  component: ResetMess,
});

function ResetMess() {
  const inside = useInsideCount();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const [resetting, setResetting] = useState(false);

  async function reset() {
    setResetting(true);
    try {
      const now = new Date().toISOString();
      const { error: occError } = await supabase
        .from("student_occupancy")
        .update({ current_status: "OUT", entered_at: null, updated_at: now })
        .eq("current_status", "IN");
      if (occError) {
        toast.error("Unable to reset the mess. Please try again.");
        return;
      }
      await supabase
        .from("mess_sessions")
        .update({ ended_at: now, reset_by: profile?.id ?? null })
        .is("ended_at", null);
      await supabase.from("mess_sessions").insert({ started_at: now });
      toast.success("Mess reset. All students are marked OUT and a new session has started.");
      await queryClient.invalidateQueries();
    } finally {
      setResetting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Reset Mess"
        description="End the current mess session and mark every student as OUT."
      />
      <Card className="max-w-2xl border-border/70 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <Alert>
            <AlertTitle>This action affects live occupancy</AlertTitle>
            <AlertDescription>
              Resetting marks all {inside.data ?? 0} students currently inside as OUT and starts a new
              mess session. Past QR transaction history is preserved and remains visible in the
              transaction history.
            </AlertDescription>
          </Alert>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg" disabled={resetting}>
                {resetting ? "Resetting..." : "Reset mess now"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset the mess?</AlertDialogTitle>
                <AlertDialogDescription>
                  Every student inside will be marked OUT and a new session will start. This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={reset}>Yes, reset mess</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
