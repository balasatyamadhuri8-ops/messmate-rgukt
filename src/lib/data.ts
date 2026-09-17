import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Settings = {
  id: string;
  total_seats: number;
  very_low_max: number;
  low_max: number;
  medium_max: number;
  high_max: number;
  breakfast_start: string;
  breakfast_end: string;
  lunch_start: string;
  lunch_end: string;
  snacks_start: string;
  snacks_end: string;
  dinner_start: string;
  dinner_end: string;
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async (): Promise<Settings> => {
      const { data, error } = await supabase.from("mess_settings").select("*").limit(1).single();
      if (error) throw error;
      return data as Settings;
    },
  });
}

export function useInsideCount() {
  return useQuery({
    queryKey: ["inside-count"],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from("student_occupancy")
        .select("id", { count: "exact", head: true })
        .eq("current_status", "IN");
      if (error) throw error;
      return count ?? 0;
    },
  });
}

export type InsideStudent = {
  id: string;
  entered_at: string | null;
  current_status: string;
  profiles: { full_name: string; student_id: string | null } | null;
};

export function useInsideStudents() {
  return useQuery({
    queryKey: ["inside-students"],
    queryFn: async (): Promise<InsideStudent[]> => {
      const { data, error } = await supabase
        .from("student_occupancy")
        .select("id, entered_at, current_status, profiles(full_name, student_id)")
        .eq("current_status", "IN")
        .order("entered_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as InsideStudent[];
    },
  });
}

export type MenuRow = {
  id: string;
  day: string;
  meal_period: string;
  items: string[];
  default_items: string[];
  is_default: boolean;
};

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: async (): Promise<MenuRow[]> => {
      const { data, error } = await supabase.from("menu").select("*");
      if (error) throw error;
      return (data ?? []) as MenuRow[];
    },
  });
}

export function useActiveSession() {
  return useQuery({
    queryKey: ["active-session"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mess_sessions")
        .select("*")
        .is("ended_at", null)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useMyProblems(studentId: string | undefined) {
  return useQuery({
    enabled: !!studentId,
    queryKey: ["my-problems", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("problems")
        .select("*")
        .eq("student_id", studentId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type AdminProblem = {
  id: string;
  student_id: string;
  category: string;
  title: string;
  description: string;
  image_url: string | null;
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  created_at: string;
  profiles: { full_name: string; student_id: string | null } | null;
};

export function useAllProblems() {
  return useQuery({
    queryKey: ["all-problems"],
    queryFn: async (): Promise<AdminProblem[]> => {
      const { data, error } = await supabase
        .from("problems")
        .select("*, profiles(full_name, student_id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as AdminProblem[];
    },
  });
}

export type Transaction = {
  id: string;
  student_id: string;
  action: "IN" | "OUT";
  created_at: string;
  performed_by_name: string | null;
  session_id: string | null;
  profiles: { full_name: string; student_id: string | null } | null;
};

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from("qr_transactions")
        .select("*, profiles(full_name, student_id)")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as unknown as Transaction[];
    },
  });
}

/** Keeps every open dashboard in sync with live database changes. */
export function useLiveSync() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("mess-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "student_occupancy" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["inside-count"] });
        void queryClient.invalidateQueries({ queryKey: ["inside-students"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "qr_transactions" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "problems" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["all-problems"] });
        void queryClient.invalidateQueries({ queryKey: ["my-problems"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "menu" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["menu"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "mess_settings" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["settings"] });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
