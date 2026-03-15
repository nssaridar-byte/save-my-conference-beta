"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Crown, Activity, Search, ShieldAlert, Loader2, AlertCircle } from "lucide-react";
import Error from "@/components/Error";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const ROLE_STYLES: Record<string, string> = {
  PRO: "bg-primary/10 text-primary border-primary/20",
  ADMIN: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  FREE: "bg-secondary text-muted-foreground border-border",
};

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  usage: string;
}

interface AdminStat {
  label: string;
  value: string;
  delta: string;
  icon: any;
  color: string;
}

const ICON_MAP: Record<string, any> = {
  TrendingUp,
  Users,
  Crown,
  Activity
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/admin/stats")
      ]);
      setUsers(usersRes.data.users);
      setStats(statsRes.data.stats.map((s: any) => ({
        ...s,
        icon: ICON_MAP[s.icon] || Activity
      })));
    } catch (err: any) {
      setError(err.response?.data || err.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "PRO" ? "FREE" : "PRO";
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      // Refresh stats as well since MRR/Pro count changed
      const statsRes = await axios.get("/api/admin/stats");
      setStats(statsRes.data.stats.map((s: any) => ({
        ...s,
        icon: ICON_MAP[s.icon] || Activity
      })));
    } catch (err: any) {
      alert(err.response?.data || "Failed to update role");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground font-geist animate-pulse">Establishing Command Access...</p>
      </div>
    );
  }

  if (error) {
    const isForbidden = error.includes("Forbidden") || error.includes("403") || error.includes("access required");
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 text-center bg-destructive/5 rounded-3xl border border-destructive/10">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-playfair font-bold text-foreground mb-2">
            {isForbidden ? "Restricted Area" : "Access Denied"}
          </h2>
          <p className="text-muted-foreground max-w-sm">
            {isForbidden 
              ? "You do not have the required security clearance to view this command center. Please contact a system administrator if you believe this is an error."
              : error}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full">
            Retry Connection
          </Button>
          {isForbidden && (
            <Button onClick={() => window.location.href = "/dashboard"} className="rounded-full">
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

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
          {stats.map((s) => (
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                <AnimatePresence>
                  {filteredUsers.map((user) => (
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
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[user.role] || ROLE_STYLES.FREE}`}>
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateRole(user.id, user.role)}
                            disabled={user.role === "ADMIN"}
                            className="rounded-full border-primary/30 text-primary hover:bg-primary/10 text-xs"
                          >
                            {user.role === "FREE" ? "Grant Pro" : user.role === "PRO" ? "Revoke Pro" : "Admin Override"}
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive text-xs">
                            {user.status === "Active" ? "Suspend" : "Restore"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
            {filteredUsers.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No delegates found matching your criteria.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
