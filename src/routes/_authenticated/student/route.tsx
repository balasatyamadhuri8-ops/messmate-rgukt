import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  QrCode,
  User,
  Users,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/mess/AppShell";

const items: NavItem[] = [
  { to: "/student", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
  { to: "/student/status", label: "Mess Status", icon: <Users className="size-4" /> },
  { to: "/student/menu", label: "Food Menu", icon: <CalendarDays className="size-4" /> },
  { to: "/student/report", label: "Report a Problem", icon: <AlertCircle className="size-4" /> },
  {
    to: "/student/problems",
    label: "My Reported Problems",
    icon: <ClipboardList className="size-4" />,
  },
  { to: "/student/qr", label: "My QR Code", icon: <QrCode className="size-4" /> },
  { to: "/student/profile", label: "Profile", icon: <User className="size-4" /> },
];

export const Route = createFileRoute("/_authenticated/student")({
  beforeLoad: ({ context }) => {
    if ((context as { role?: string }).role !== "student") {
      throw redirect({ to: "/admin" });
    }
  },
  component: () => (
    <AppShell items={items}>
      <Outlet />
    </AppShell>
  ),
});
