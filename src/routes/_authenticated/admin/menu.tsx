import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/mess/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useMenu } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { DAYS, MEALS } from "@/lib/mess";

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: AdminMenu,
});

function AdminMenu() {
  const menu = useMenu();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  if (menu.isLoading) return <Skeleton className="h-64 w-full" />;

  const rows = menu.data ?? [];

  async function save(id: string, items: string[]) {
    setSavingId(id);
    try {
      const { error } = await supabase
        .from("menu")
        .update({
          items,
          is_default: false,
          updated_at: new Date().toISOString(),
          updated_by: profile?.id ?? null,
        })
        .eq("id", id);
      if (error) {
        toast.error("Unable to save the menu. Please try again.");
        return;
      }
      toast.success("Menu updated.");
      setDrafts((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
      await queryClient.invalidateQueries({ queryKey: ["menu"] });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Food Menu Management"
        description="Edit the weekly menu. Changes are saved to the database and shown to every student instantly."
      />
      <Tabs defaultValue={DAYS[0]}>
        <TabsList className="mb-4 flex w-full flex-wrap justify-start gap-1">
          {DAYS.map((d) => (
            <TabsTrigger key={d} value={d}>
              {d.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        {DAYS.map((day) => (
          <TabsContent key={day} value={day} className="grid gap-4 md:grid-cols-2">
            {MEALS.map((meal) => {
              const row = rows.find((r) => r.day === day && r.meal_period === meal);
              if (!row) return null;
              const draft = drafts[row.id] ?? row.items.join("\n");
              const dirty = drafts[row.id] !== undefined;
              return (
                <Card key={row.id} className="border-border/70 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{meal}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Label htmlFor={row.id}>One item per line</Label>
                    <Textarea
                      id={row.id}
                      rows={5}
                      value={draft}
                      onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: e.target.value }))}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        disabled={!dirty || savingId === row.id}
                        onClick={() =>
                          save(
                            row.id,
                            draft
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          )
                        }
                      >
                        {savingId === row.id ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={savingId === row.id}
                        onClick={() => save(row.id, row.default_items)}
                      >
                        Restore default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
