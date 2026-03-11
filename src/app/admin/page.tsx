"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const mockUsers = [
  { id: "cm01pxd3s", name: "Alice Delegate", email: "alice@example.com", role: "PRO", status: "Active" },
  { id: "cm01pye4t", name: "Bob Representative", email: "bob@example.com", role: "FREE", status: "Active" },
  { id: "cm01pzf5u", name: "Charlie Admin", email: "charlie@example.com", role: "ADMIN", status: "Active" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-playfair font-bold tracking-tight text-destructive">Admin Command Center</h2>
        <p className="text-muted-foreground">
          System overview, user management, and manual overrides.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total MRR</h3>
          <div className="mt-2 text-2xl font-bold font-geist">$1,280.00</div>
          <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Active Delegates</h3>
          <div className="mt-2 text-2xl font-bold font-geist">342</div>
          <p className="text-xs text-muted-foreground mt-1">+8 new this week</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Pro Subscribers</h3>
          <div className="mt-2 text-2xl font-bold font-geist">160</div>
          <p className="text-xs text-muted-foreground mt-1">46.7% conversion rate</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-sm font-medium text-muted-foreground">System Status</h3>
          <div className="mt-2 text-2xl font-bold font-geist text-primary">All Systems Nominal</div>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="border-b p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-geist font-semibold text-xl">User Management</h3>
              <p className="text-sm text-muted-foreground">Search, suspend, or upgrade users.</p>
            </div>
            <div className="flex items-center gap-2">
                <input 
                  type="search" 
                  placeholder="Search delegates..." 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[300px]"
                />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Delegate Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    user.role === 'PRO' ? 'bg-primary/10 text-primary' : 
                    user.role === 'ADMIN' ? 'bg-destructive/10 text-destructive' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">
                       {user.role === 'FREE' ? 'Grant Premium' : 'Revoke Premium'}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                       Suspend
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
