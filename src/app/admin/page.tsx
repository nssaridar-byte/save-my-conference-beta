"use client";

import { motion, type Variants } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Crown, Activity, Search, ShieldAlert } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const STATS = [
  { label: "Total MRR", value: "$1,280", delta: "+12% this month", icon: TrendingUp, color: "text-green-500" },
  { label: "Active Delegates", value: "342", delta: "+8 this week", icon: Users, color: "text-primary" },
  { label: "Pro Subscribers", value: "160", delta: "46.7% conversion", icon: Crown, color: "text-primary" },
  { label: "System Status", value: "Nominal", delta: "All systems operational", icon: Activity, color: "text-green-500" },
];

const ROLE_STYLES: Record<string, string> = {
  PRO: "bg-primary/10 text-primary border-primary/20",
  ADMIN: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  FREE: "bg-secondary text-muted-foreground border-border",
};

const mockUsers = [
  { id: "1", name: "Alice Delegate", email: "alice@example.com", role: "PRO", status: "Active", usage: "12 speeches" },
  { id: "2", name: "Bob Representative", email: "bob@example.com", role: "FREE", status: "Active", usage: "1/2 speeches" },
  { id: "3", name: "Charlie Admin", email: "charlie@example.com", role: "ADMIN", status: "Active", usage: "Unlimited" },
  { id: "4", name: "Diana Minister", email: "diana@example.com", role: "FREE", status: "Suspended", usage: "2/2 speeches" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">Admin Panel</h2>
          <p className="text-muted-foreground">System overview, user management, and manual overrides.</p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-3xl border border-primary/10 bg-card shadow-sm p-7 flex flex-col justify-between gap-4 group hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div>
                <p className="text-3xl font-playfair font-black text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.delta}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* User Table */}
        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-geist font-semibold text-xl text-foreground">User Management</h3>
              <p className="text-sm text-muted-foreground">Search, upgrade, or suspend delegates.</p>
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search delegates..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-medium text-muted-foreground pl-8">Delegate</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Email</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Role</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Today's Usage</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="font-medium text-muted-foreground text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id} className="border-border/50 hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-playfair font-bold text-sm shrink-0">
                          {user.name[0]}
                        </div>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[user.role]}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{user.usage}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === "Active" ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-destructive"}`} />
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="rounded-full border-primary/30 text-primary hover:bg-primary/10 text-xs">
                          {user.role === "FREE" ? "Grant Pro" : "Revoke Pro"}
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive text-xs">
                          {user.status === "Active" ? "Suspend" : "Restore"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
