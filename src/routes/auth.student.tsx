import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/mess/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/student")({
  head: () => ({
    meta: [
      { title: "Student Login — RGUKT Mess Management" },
      { name: "description", content: "Sign in to the RGUKT Srikakulam student mess portal." },
      { property: "og:title", content: "Student Login — RGUKT Mess Management" },
      {
        property: "og:description",
        content: "Sign in to the RGUKT Srikakulam student mess portal.",
      },
    ],
  }),
  component: StudentLogin,
});

function StudentLogin() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error || !data.user) {
        toast.error("Invalid email or password.");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profile?.role !== "student") {
        await supabase.auth.signOut();
        toast.error("This account is not a student account. Please use the Admin / Staff portal.");
        return;
      }
      await refresh();
      toast.success("Signed in successfully.");
      void navigate({ to: "/student", replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Student Login"
      description="Sign in with your college email to access the mess portal."
      footer={
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="font-medium text-primary hover:underline">
            Create Account
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email ID</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@rguktsklm.ac.in"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
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
        <Button asChild type="button" variant="outline" className="w-full">
          <Link to="/auth/register">Create Account</Link>
        </Button>
      </form>
    </AuthLayout>
  );
}
