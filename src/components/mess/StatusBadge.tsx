import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  Pending: "bg-warning/15 text-warning border-warning/30",
  "In Progress": "bg-primary/10 text-primary border-primary/30",
  Resolved: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/10 text-destructive border-destructive/30",
  IN: "bg-success/15 text-success border-success/30",
  OUT: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[status] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      {status}
    </span>
  );
}
