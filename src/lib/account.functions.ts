import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  studentId: z.string().trim().min(2).max(40),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});

export const registerStudent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => registerSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase();

    const { data: existingEmail } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existingEmail) {
      return { ok: false as const, message: "An account with this email already exists." };
    }

    const { data: existingStudentId } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("student_id", data.studentId)
      .maybeSingle();
    if (existingStudentId) {
      return { ok: false as const, message: "An account with this Student ID already exists." };
    }

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName, student_id: data.studentId },
    });

    if (createError || !created.user) {
      const msg = createError?.message ?? "";
      if (msg.toLowerCase().includes("already")) {
        return { ok: false as const, message: "An account with this email already exists." };
      }
      return { ok: false as const, message: "Unable to create the account. Please try again." };
    }

    const userId = created.user.id;
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      full_name: data.fullName,
      email,
      role: "student",
      student_id: data.studentId,
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return { ok: false as const, message: "An account with this Student ID already exists." };
    }

    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "student" });
    await supabaseAdmin.from("student_occupancy").insert({ student_id: userId, current_status: "OUT" });

    return { ok: true as const };
  });

const adminSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(200),
  fullName: z.string().trim().max(100).optional(),
});

export const prepareAdminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => adminSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase();

    const { data: access } = await supabaseAdmin
      .from("admin_access")
      .select("shared_password")
      .eq("id", 1)
      .maybeSingle();

    if (!access || access.shared_password !== data.password) {
      return { ok: false as const, message: "Invalid email or password." };
    }

    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (existing.role !== "admin") {
        return {
          ok: false as const,
          message: "This email is registered as a student account.",
        };
      }
      await supabaseAdmin.auth.admin.updateUserById(existing.id, { password: data.password });
      return { ok: true as const };
    }

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName || "Mess Staff" },
    });
    if (error || !created.user) {
      return { ok: false as const, message: "Unable to sign in. Please try again." };
    }

    await supabaseAdmin.from("profiles").insert({
      id: created.user.id,
      full_name: data.fullName || "Mess Staff",
      email,
      role: "admin",
    });
    await supabaseAdmin.from("user_roles").insert({ user_id: created.user.id, role: "admin" });

    return { ok: true as const };
  });
