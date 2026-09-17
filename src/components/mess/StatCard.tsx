import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/70 shadow-sm", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
        </div>
        {icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            {icon}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
