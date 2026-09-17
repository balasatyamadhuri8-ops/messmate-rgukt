import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  AlertCircle,
  History,
  LayoutDashboard,
  RotateCcw,
  ScanLine,
  Settings,
  User,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/mess/AppShell";

const items: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
  { to: "/admin/scanner", label: "QR Scanner", icon: <ScanLine className="size-4" /> },
  { to: "/admin/occupancy", label: "Occupancy", icon: <Users className="size-4" /> },
  { to: "/admin/transactions", label: "QR Transaction History", icon: <History className="size-4" /> },
  { to: "/admin/problems", label: "Reported Problems", icon: <AlertCircle className="size-4" /> },
  {
    to: "/admin/menu",
    label: "Food Menu Management",
    icon: <UtensilsCrossed className="size-4" />,
  },
  { to: "/admin/reset", label: "Reset Mess", icon: <RotateCcw className="size-4" /> },
  { to: "/admin/settings", label: "Mess Settings", icon: <Settings className="size-4" /> },
  { to: "/admin/profile", label: "Profile", icon: <User className="size-4" /> },
];

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    if ((context as { role?: string }).role !== "admin") {
      throw redirect({ to: "/student" });
    }
  },
  component: () => (
    <AppShell items={items}>
      <Outlet />
    </AppShell>
  ),
});
