import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RGUKT Mess Management — Student & Staff Portal" },
      {
        name: "description",
        content:
          "Check live mess occupancy, seat availability, daily menu and report issues. Smart Mess Management System for RGUKT Srikakulam.",
      },
      { property: "og:title", content: "RGUKT Mess Management — Student & Staff Portal" },
      {
        property: "og:description",
        content:
          "Check live mess occupancy, seat availability, daily menu and report issues at RGUKT Srikakulam.",
      },
    ],
  }),
  component: Portal,
});

function Portal() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-5" />
          </span>
          <div>
            <p className="font-display text-base font-semibold">RGUKT Mess Management</p>
            <p className="text-xs text-muted-foreground">
              Smart Mess Management System — RGUKT Srikakulam
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-12">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome to the college mess portal
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Live seat availability, crowd levels, the weekly food menu and issue reporting — in one
            place. Please choose your portal to continue.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <PortalCard
            to="/auth/student"
            icon={<GraduationCap className="size-6" />}
            title="Student Portal"
            description="Check mess occupancy, view the menu, show your QR code and report problems."
            cta="Continue as Student"
          />
          <PortalCard
            to="/auth/admin"
            icon={<ShieldCheck className="size-6" />}
            title="Admin / Staff Portal"
            description="Scan student QR codes, manage occupancy, menu, reports and mess settings."
            cta="Continue as Admin / Staff"
          />
        </div>
      </main>

      <footer className="border-t border-border py-5 text-center text-sm text-muted-foreground">
        RGUKT Srikakulam · Mess Management System
      </footer>
    </div>
  );
}

function PortalCard({
  to,
  icon,
  title,
  description,
  cta,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link to={to} className="group block focus-visible:outline-none">
      <Card className="h-full border-border/70 transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
            {icon}
          </span>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
