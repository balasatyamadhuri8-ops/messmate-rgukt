import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AuthLayout } from "@/components/mess/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { prepareAdminLogin } from "@/lib/account.functions";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/admin")({
  head: () => ({
    meta: [
      { title: "Admin / Staff Login — RGUKT Mess Management" },
      {
        name: "description",
        content: "Mess staff sign-in for QR scanning, occupancy, menu and reports.",
      },
      { property: "og:title", content: "Admin / Staff Login — RGUKT Mess Management" },
      {
        property: "og:description",
        content: "Mess staff sign-in for QR scanning, occupancy, menu and reports.",
      },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const prepare = useServerFn(prepareAdminLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const normalized = email.trim().toLowerCase();
      const result = await prepare({ data: { email: normalized, password } });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      });
      if (error || !data.user) {
        toast.error("Invalid email or password.");
        return;
      }
      await refresh();
      toast.success("Signed in successfully.");
      void navigate({ to: "/admin", replace: true });
    } catch {
      toast.error("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Admin / Staff Login"
      description="Authorised mess staff only. Use your staff email and the mess staff password."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email ID</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
}
