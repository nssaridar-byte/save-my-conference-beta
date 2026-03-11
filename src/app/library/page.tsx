"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Copy } from "lucide-react";

export default function Library() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-playfair font-bold tracking-tight">Dual Library</h2>
        <p className="text-muted-foreground">
          Manage your personal vault or explore the global repository.
        </p>
      </div>
      
      <Tabs defaultValue="vault" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="vault">My Vault</TabsTrigger>
          <TabsTrigger value="repository">Global Repository</TabsTrigger>
        </TabsList>
        <TabsContent value="vault" className="mt-6 border rounded-xl p-8 bg-card flex flex-col items-center justify-center min-h-[400px] text-center">
             <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
             <h3 className="text-lg font-playfair font-semibold">Your Vault is Empty</h3>
             <p className="text-muted-foreground max-w-sm mt-2">
               Upload position papers, research docs, and drafts here to keep them safe.
             </p>
             <Button className="mt-6">Upload Document</Button>
        </TabsContent>
        <TabsContent value="repository" className="mt-6">
          <div className="grid gap-4">
             {/* Mock Item */}
             <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 flex items-center justify-between">
                <div>
                   <h4 className="font-geist font-semibold">Cyber Warfare Framework (UK)</h4>
                   <p className="text-sm text-muted-foreground mt-1">Uploaded by @delegateJohn • 2 days ago</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" /> Clone to Vault
                </Button>
             </div>
             {/* Mock Item */}
             <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 flex items-center justify-between">
                <div>
                   <h4 className="font-geist font-semibold">Resolution 1A - Autonomous Systems</h4>
                   <p className="text-sm text-muted-foreground mt-1">Uploaded by @admin • 1 week ago</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" /> Clone to Vault
                </Button>
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
