"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const mockEvents = [
  "BREAKING: Satellite telemetry indicates unexpected movement near the 38th parallel.",
  "UPDATE: European markets plunge 4% amidst rumors of trade embargo.",
  "URGENT: NGO reports massive blackout in regional capital following cyberattack.",
];

export default function CrisisSimulator() {
  const [currentEvent, setCurrentEvent] = useState(0);

  // Simple ticker rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEvent((prev) => (prev + 1) % mockEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-playfair font-bold tracking-tight text-primary">Crisis Simulator</h2>
        <p className="text-muted-foreground">
          Respond to real-time events and submit directives.
        </p>
      </div>

      {/* Ticker */}
      <div className="w-full bg-destructive text-destructive-foreground px-4 py-3 rounded-lg font-geist font-bold text-sm flex items-center gap-4 overflow-hidden border border-destructive/50 shadow-md relative">
        <span className="shrink-0 uppercase tracking-wider animate-pulse">Live Situation</span>
        <div className="w-px h-4 bg-destructive-foreground/30 shrink-0" />
        <p className="truncate transition-all duration-300">
          {mockEvents[currentEvent]}
        </p>
      </div>
      
      <div className="flex-1 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6">
           <h3 className="font-geist font-semibold text-lg text-primary mb-4">Command Terminal</h3>
           <textarea
             className="w-full flex-1 p-4 bg-background border rounded-md focus-visible:ring-1 focus-visible:ring-primary outline-none resize-none font-mono text-sm placeholder:text-muted-foreground/50"
             placeholder="> Enter directive here. Be precise. E.g. Deploy 3rd Fleet to sector 7G..."
           />
           <div className="mt-4 flex justify-end">
             <Button variant="default" className="w-full md:w-auto font-geist uppercase tracking-widest">
               Execute Directive
             </Button>
           </div>
        </div>
        
        <div className="rounded-xl border bg-muted/30 text-card-foreground shadow-sm flex flex-col p-6 items-center justify-center opacity-70">
           <h3 className="font-geist font-bold text-xl text-primary/80 uppercase tracking-widest mb-2">Global Impact Score</h3>
           <p className="text-6xl font-playfair font-black text-muted-foreground">--</p>
           <p className="text-sm mt-4 text-center text-muted-foreground max-w-xs">
             Awaiting directive submission and subsequent evaluation by the Dias.
           </p>
        </div>
      </div>
    </div>
  );
}
