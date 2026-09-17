import { supabase } from "@/integrations/supabase/client";

export type ScannedStudent = {
  id: string;
  full_name: string;
  student_id: string | null;
  email: string;
  qr_code: string;
  status: "IN" | "OUT";
};

export async function findStudentByQr(qr: string): Promise<ScannedStudent | null> {
  const value = qr.trim();
  if (!/^[0-9a-fA-F-]{36}$/.test(value)) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, student_id, email, qr_code, role")
    .eq("qr_code", value)
    .maybeSingle();

  if (!profile || profile.role !== "student") return null;

  const { data: occupancy } = await supabase
    .from("student_occupancy")
    .select("current_status")
    .eq("student_id", profile.id)
    .maybeSingle();

  return {
    id: profile.id,
    full_name: profile.full_name,
    student_id: profile.student_id,
    email: profile.email,
    qr_code: profile.qr_code,
    status: (occupancy?.current_status as "IN" | "OUT") ?? "OUT",
  };
}

export async function markAttendance(
  student: ScannedStudent,
  action: "IN" | "OUT",
  admin: { id: string; name: string },
): Promise<{ ok: boolean; message: string }> {
  if (student.status === action) {
    return {
      ok: false,
      message:
        action === "IN"
          ? "Student is already inside the mess."
          : "Student is currently outside the mess.",
    };
  }

  const { data: session } = await supabase
    .from("mess_sessions")
    .select("id")
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: updateError } = await supabase
    .from("student_occupancy")
    .update({
      current_status: action,
      entered_at: action === "IN" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("student_id", student.id);

  if (updateError) {
    return { ok: false, message: "Unable to save the transaction. Please try again." };
  }

  const { error: txError } = await supabase.from("qr_transactions").insert({
    student_id: student.id,
    session_id: session?.id ?? null,
    action,
    performed_by: admin.id,
    performed_by_name: admin.name,
  });

  if (txError) {
    return { ok: false, message: "Unable to save the transaction. Please try again." };
  }

  return { ok: true, message: `Student marked ${action} successfully.` };
}
