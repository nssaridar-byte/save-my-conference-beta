"use client";

import { Suspense, useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Crown, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  User, 
  Info,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const billing = searchParams.get("billing") || "monthly";
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const price = billing === "monthly" ? 8 : 80;
  const label = billing === "monthly" ? "Senior Diplomat (Monthly)" : "Senior Diplomat (Annual)";

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(async () => {
      try {
        await axios.post("/api/subscription/success", { billing });
        setIsProcessing(false);
        setIsSuccess(true);
      } catch (err) {
        setIsProcessing(false);
        alert("Payment processing failed. Please try again.");
      }
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="relative inline-block">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/20"
            >
              <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-8 h-8 text-primary opacity-50" />
            </motion.div>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-playfair text-4xl font-bold text-foreground">Welcome, Senior Diplomat</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Your security clearance has been elevated. You now have unlimited access to every module in the suite.
            </p>
          </div>

          <div className="pt-8 space-y-4">
            <Button 
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-full py-6 bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 group"
            >
              Enter the Dashboard
              <motion.span 
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </motion.span>
            </Button>
            <p className="text-sm text-muted-foreground italic">A confirmation email has been sent to your inbox.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <nav className="p-6 md:px-12 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-playfair font-black">M</div>
          <span className="font-playfair font-bold tracking-tight text-lg">CHECKOUT</span>
        </div>
        <Link 
          href="/pricing" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 p-6 md:p-12">
        {/* Form Section */}
        <section className="lg:col-span-3 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-playfair font-bold">Secure Checkout</h2>
            <p className="text-muted-foreground">Complete your subscription to unlock premium features.</p>
          </div>

          <form onSubmit={handlePayment} className="grid gap-6">
            <div className="grid gap-4">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Full Name
              </label>
              <input 
                required
                className="w-full bg-card border border-border rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="Ex. Alexander Hamilton"
                value={formState.name}
                onChange={(e) => setFormState({...formState, name: e.target.value})}
              />
            </div>

            <div className="grid gap-4">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" /> Card Details
              </label>
              <div className="relative">
                <input 
                  required
                  className="w-full bg-card border border-border rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-mono tracking-wider"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={formState.cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                    setFormState({...formState, cardNumber: val});
                  }}
                />
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    required
                    className="w-full bg-card border border-border rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-mono"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={formState.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                      setFormState({...formState, expiry: val});
                    }}
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                <div className="relative">
                  <input 
                    required
                    className="w-full bg-card border border-border rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-mono"
                    placeholder="CVC"
                    maxLength={3}
                    value={formState.cvc}
                    onChange={(e) => setFormState({...formState, cvc: e.target.value.replace(/\D/g, '')})}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your payment is secure. We use Stripe for transaction processing. We do not store your full card details on our servers.
              </p>
            </div>

            <Button 
              type="submit"
              disabled={isProcessing}
              className="w-full py-7 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay ${price} Now</>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="w-3 h-3" /> Encrypted with 256-bit SSL
            </p>
          </form>
        </section>

        {/* Order Summary Section */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-[32px] p-8 space-y-8 sticky top-32 shadow-xl shadow-foreground/[0.02]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider w-fit">
                <Crown className="w-3 h-3" /> Order Summary
              </div>
              <h3 className="text-2xl font-playfair font-bold">Plan Selection</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">Unlimited MUN simulations & AI insights</p>
                </div>
                <span className="font-bold text-lg">${price}</span>
              </div>
              
              <div className="border-t border-border/50 pt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${price}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-xl font-playfair">Total Today</span>
                  <span className="text-3xl font-black font-playfair text-primary">${price}.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-2">
                <Info className="w-3 h-3" /> Included with Pro
              </p>
              <ul className="space-y-3">
                {[
                  "Unlimited Speech Analyses",
                  "AI Rebuttal Engine",
                  "Advanced Dossier Export",
                  "Priority Support"
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="max-w-6xl mx-auto p-12 text-center text-muted-foreground text-xs border-t border-border/30">
        By completing your purchase, you agree to our Terms of Service and Privacy Policy. 
        Your subscription will automatically renew unless cancelled in settings.
      </footer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary/20" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
