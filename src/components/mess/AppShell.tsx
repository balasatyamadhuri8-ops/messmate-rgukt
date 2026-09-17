import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, UtensilsCrossed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLiveSync } from "@/lib/data";
import { cn } from "@/lib/utils";

export type NavItem = { to: string; label: string; icon: ReactNode };

export function AppShell({ items, children }: { items: NavItem[]; children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  useLiveSync();

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/", replace: true });
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3 border-b border-border px-4 py-4">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <UtensilsCrossed className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold leading-tight">RGUKT Mess Management</p>
        <p className="truncate text-xs text-muted-foreground">RGUKT Srikakulam</p>
      </div>
    </div>
  );

  const footer = (
    <div className="border-t border-border p-3">
      <div className="mb-2 px-1">
        <p className="truncate text-sm font-medium">{profile?.full_name || "—"}</p>
        <p className="text-xs capitalize text-muted-foreground">
          {profile?.role === "admin" ? "Admin / Staff" : "Student"}
        </p>
      </div>
      <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
        <LogOut className="size-4" /> Sign Out
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        {brand}
        {nav}
        {footer}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">{brand}</div>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <span className="font-display text-sm font-semibold">RGUKT Mess Management</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
