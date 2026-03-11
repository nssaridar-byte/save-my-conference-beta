"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Settings() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-playfair font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and subscription preferences.
        </p>
      </div>
      
      {/* Profile Section */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="border-b p-6">
          <h3 className="font-geist font-semibold text-xl">Profile Information</h3>
          <p className="text-muted-foreground text-sm">Update your name, email, and password.</p>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Full Name
            </label>
            <Input defaultValue="John Doe" className="max-w-md" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email Address
            </label>
            <Input defaultValue="john.doe@example.com" type="email" className="max-w-md" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <Input type="password" value="********" className="max-w-md" readOnly />
             <Button variant="link" className="w-fit p-0 h-auto font-geist text-sm text-primary">
              Change Password
            </Button>
          </div>
          <Button className="w-fit mt-2">Save Changes</Button>
        </div>
      </div>
      
      {/* Billing Section */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="border-b p-6 flex items-center justify-between">
            <div>
              <h3 className="font-geist font-semibold text-xl">Subscription & Billing</h3>
              <p className="text-muted-foreground text-sm">You are currently on the <span className="font-bold text-foreground">FREE</span> plan.</p>
            </div>
        </div>
        <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
                
                {/* Free Tier */}
                <div className="flex flex-col rounded-xl border p-6 bg-muted/20">
                    <h4 className="font-geist font-bold text-lg">Observer (Free)</h4>
                    <div className="mt-4 flex items-baseline text-4xl font-extrabold font-playfair">
                      $0<span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                    </div>
                    <ul className="mt-6 space-y-3 flex-1">
                        <li className="flex gap-x-3 text-sm">✓ 3 Quizzes</li>
                        <li className="flex gap-x-3 text-sm">✓ 2 Speeches</li>
                        <li className="flex gap-x-3 text-sm">✓ 1 Debate</li>
                        <li className="flex gap-x-3 text-sm">✓ 2 Crisis Simulations</li>
                    </ul>
                    <Button variant="outline" className="mt-8 w-full" disabled>Current Plan</Button>
                </div>
                
                {/* Pro Tier */}
                <div className="flex flex-col rounded-xl border-2 border-primary bg-primary/5 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        Recommended
                    </div>
                    <h4 className="font-geist font-bold text-lg text-primary">Senior Diplomat (Pro)</h4>
                    <div className="mt-4 flex flex-col gap-1">
                        <div className="flex items-baseline text-4xl font-extrabold font-playfair">
                          $8<span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                        </div>
                        <span className="text-xs text-muted-foreground">or $80/yr (Save 16%)</span>
                    </div>
                    
                    <ul className="mt-6 space-y-3 flex-1 font-medium">
                        <li className="flex gap-x-3 text-sm">✓ Unlimited Speeches & Analysis</li>
                        <li className="flex gap-x-3 text-sm">✓ Unlimited Crisis Simulations</li>
                        <li className="flex gap-x-3 text-sm">✓ Priority Global Repository Cloning</li>
                        <li className="flex gap-x-3 text-sm">✓ Advanced Dossier Export</li>
                    </ul>
                    <div className="mt-8 space-y-2">
                        <Button className="w-full uppercase font-geist tracking-widest bg-primary text-primary-foreground hover:bg-primary/90">
                            Upgrade to Pro
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">Includes a 3-day Free Trial</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
