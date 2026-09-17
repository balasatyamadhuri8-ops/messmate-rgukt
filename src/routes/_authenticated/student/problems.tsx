import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/mess/PageHeader";
import { ProblemImage } from "@/components/mess/ProblemImage";
import { StatusBadge } from "@/components/mess/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyProblems } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/student/problems")({
  component: MyProblems,
});

function MyProblems() {
  const { profile } = useAuth();
  const problems = useMyProblems(profile?.id);

  return (
    <div>
      <PageHeader
        title="My Reported Problems"
        description="Track the status of the problems you reported."
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
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-semibold">{p.title}</h2>
                      <p className="text-sm text-muted-foreground">{p.category}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{p.description}</p>
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
