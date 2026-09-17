import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/mess/PageHeader";
import { StatusBadge } from "@/components/mess/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTransactions } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/admin/transactions")({
  component: Transactions,
});

function Transactions() {
  const transactions = useTransactions();
  const [action, setAction] = useState("all");
  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const list = transactions.data ?? [];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return list.filter((t) => {
      if (action !== "all" && t.action !== action) return false;
      if (period === "today" && new Date(t.created_at) < startOfToday) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const name = t.profiles?.full_name?.toLowerCase() ?? "";
        const sid = t.profiles?.student_id?.toLowerCase() ?? "";
        if (!name.includes(q) && !sid.includes(q)) return false;
      }
      return true;
    });
  }, [transactions.data, action, period, search]);

  return (
    <div>
      <PageHeader
        title="QR Transaction History"
        description="Every IN and OUT transaction recorded by mess staff. History is preserved across mess resets."
      />

      <Card className="mb-4 border-border/70 shadow-sm">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="action">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="IN">IN</SelectItem>
                <SelectItem value="OUT">OUT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Student</Label>
            <Input
              id="search"
              placeholder="Name or Student ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-0">
          {transactions.isLoading ? (
            <Skeleton className="m-4 h-40" />
          ) : rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No QR transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Admin / Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((t) => {
                    const d = new Date(t.created_at);
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs">
                          {t.id.slice(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">{t.profiles?.full_name ?? "—"}</TableCell>
                        <TableCell>{t.profiles?.student_id ?? "—"}</TableCell>
                        <TableCell>
                          <StatusBadge status={t.action} />
                        </TableCell>
                        <TableCell>{d.toLocaleDateString()}</TableCell>
                        <TableCell>{d.toLocaleTimeString()}</TableCell>
                        <TableCell>{t.performed_by_name ?? "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
