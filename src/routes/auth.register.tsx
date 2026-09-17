import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AuthLayout } from "@/components/mess/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { registerStudent } from "@/lib/account.functions";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Student Registration — RGUKT Mess Management" },
      {
        name: "description",
        content: "Create your RGUKT Srikakulam student mess account and get your mess QR code.",
      },
      { property: "og:title", content: "Student Registration — RGUKT Mess Management" },
      {
        property: "og:description",
        content: "Create your RGUKT Srikakulam student mess account and get your mess QR code.",
      },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const register = useServerFn(registerStudent);
  const [form, setForm] = useState({
    fullName: "",
    studentId: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (form.fullName.trim().length < 2) next['fullName'] = "Please enter your full name.";
    if (form.studentId.trim().length < 2) next['studentId'] = "Please enter your Student ID.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next['email'] = "Please enter a valid email address.";
    if (form.password.length < 6) next['password'] = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) next['confirm'] = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !validate()) return;
    setLoading(true);
    try {
      const result = await register({
        data: {
          fullName: form.fullName.trim(),
          studentId: form.studentId.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        },
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (error) {
        toast.success("Account created. Please sign in.");
        void navigate({ to: "/auth/student", replace: true });
        return;
      }
      await refresh();
      toast.success("Account created successfully.");
      void navigate({ to: "/student", replace: true });
    } catch {
      toast.error("Unable to create the account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create Student Account"
      description="Register once to access mess status, menu, QR code and problem reporting."
      footer={
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/student" className="font-medium text-primary hover:underline">
            Student Login
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <Field
          id="fullName"
          label="Full Name"
          value={form.fullName}
          onChange={(v) => set("fullName", v)}
          error={errors['fullName'] ?? ""}
        />
        <Field
          id="studentId"
          label="Student ID"
          value={form.studentId}
          onChange={(v) => set("studentId", v)}
          error={errors['studentId'] ?? ""}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          error={errors['email'] ?? ""}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => set("password", v)}
          error={errors['password'] ?? ""}
        />
        <Field
          id="confirm"
          label="Confirm Password"
          type="password"
          value={form.confirm}
          onChange={(v) => set("confirm", v)}
          error={errors['confirm'] ?? ""}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
