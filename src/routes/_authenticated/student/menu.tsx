import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/mess/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenu, useSettings } from "@/lib/data";
import { currentMealPeriod, DAYS, formatTime, MEALS, todayName } from "@/lib/mess";

export const Route = createFileRoute("/_authenticated/student/menu")({
  component: FoodMenu,
});

function FoodMenu() {
  const menu = useMenu();
  const settings = useSettings();

  if (menu.isLoading || !settings.data || !menu.data) return <Skeleton className="h-64 w-full" />;

  const day = todayName();
  const meal = currentMealPeriod(settings.data);
  const active = menu.data.find((m) => m.day === day && m.meal_period === meal);
  const windows: Record<string, string> = {
    Breakfast: `${formatTime(settings.data.breakfast_start)} – ${formatTime(settings.data.breakfast_end)}`,
    Lunch: `${formatTime(settings.data.lunch_start)} – ${formatTime(settings.data.lunch_end)}`,
    Snacks: `${formatTime(settings.data.snacks_start)} – ${formatTime(settings.data.snacks_end)}`,
    Dinner: `${formatTime(settings.data.dinner_start)} – ${formatTime(settings.data.dinner_end)}`,
  };

  return (
    <div>
      <PageHeader title="Food Menu" description={`Today is ${day}.`} />

      <Card className="mb-6 border-primary/30 bg-secondary/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {meal ? `Today's ${meal}` : "No active meal period right now."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meal && active ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {active.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              You can still browse the full weekly menu below.
            </p>
          )}
        </CardContent>
      </Card>

      <h2 className="mb-3 text-lg font-semibold">Weekly menu</h2>
      <Tabs defaultValue={day}>
        <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1">
          {DAYS.map((d) => (
            <TabsTrigger key={d} value={d} className="text-xs sm:text-sm">
              {d.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        {DAYS.map((d) => (
          <TabsContent key={d} value={d} className="grid gap-4 sm:grid-cols-2">
            {MEALS.map((m) => {
              const row = menu.data!.find((x) => x.day === d && x.meal_period === m);
              return (
                <Card key={m} className="border-border/70 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{m}</span>
                      <span className="text-xs font-normal text-muted-foreground">{windows[m]}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm">
                      {(row?.items ?? []).map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-muted-foreground/50" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
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
