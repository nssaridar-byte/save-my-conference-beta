"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseUser } from "../../../contexts/UserContext";
import Error from "@/components/Error";
import axios from "axios";
import { Logo } from "@/components/logo";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = UseUser();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/verify", { email, code });
      setUser(res.data.user);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-foreground">
            {isSuccess ? "Identity Verified" : "Verify Your Mission"}
          </h1>
          <p className="text-muted-foreground">
            {isSuccess 
              ? "Your credentials have been authenticated. Redirecting to command center..."
              : `Enter the 6-digit code sent to ${email || "your email"}.`}
          </p>
        </div>

        {error && <Error error={error} />}

        {isSuccess ? (
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <p className="text-primary font-medium">Welcome aboard, Delegate.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-12 pr-4 py-4 text-2xl tracking-[0.5em] font-mono rounded-2xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || code.length !== 6}
              className="w-full py-6 rounded-full font-geist font-semibold text-lg"
            >
              {isLoading ? "Authenticating..." : "Establish Access"}
            </Button>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => router.push("/login")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                Return to Login <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
