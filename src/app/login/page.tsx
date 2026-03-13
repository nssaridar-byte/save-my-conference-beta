"use client";
import axios from "axios"
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UseUser } from "../../../contexts/UserContext";
import Error from "@/components/Error";
import { useRouter } from "next/navigation";
import { Captcha } from "@/components/captcha";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { setUser } = UseUser()
  const router = useRouter()
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary flex-col items-center justify-center p-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-black/40 pointer-events-none" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm">
          {/* Logo mark */}
          <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center text-white font-playfair font-bold text-3xl shadow-lg">M</div>
          {/* Brand name */}
          <div>
            <p className="text-white font-playfair font-bold text-2xl tracking-wide">SAVE MY CONFERENCE</p>
            <p className="text-white/60 text-xs uppercase tracking-widest mt-1">MUN Command Center</p>
          </div>
          {/* Divider */}
          <div className="w-12 h-px bg-white/30" />
          {/* Quote */}
          <blockquote className="text-white/90 font-playfair text-2xl font-semibold leading-snug">
            "Diplomacy is the art of letting someone have your way."
          </blockquote>
          <p className="text-white/50 font-geist text-sm">— Daniele Vare, Italian Diplomat</p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          {/* Logo (mobile only) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-playfair font-bold">M</div>
            <p className="font-playfair font-bold text-lg">Save My Conference</p>
          </div>

          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome back, Delegate." : "Join the Command Center."}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Enter your credentials to access your diplomatic command center."
                : "Create your account to begin your MUN preparation journey."}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-muted/40 p-1 rounded-full mb-8">
            <button
              onClick={() => { setMode("login"); setError("") }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${mode === "login" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError("") }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${mode === "signup" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                }`}
            >
              Create Account
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => {
            e.preventDefault()
            if (mode == "login") {
              axios.post("/api/login", {
                email,
                password
              }).then((res) => {
                setUser(res.data.user)
                router.push("/dashboard")
              }).catch((err) => {
                console.log(err);
                setError(err.response.data ?? err.message)
              })
            } else if (mode == "signup") {
              axios.post("/api/signup", {
                name,
                email,
                password
              }).then((res) => {
                router.push("/dashboard")
                setUser(res.data.user)
              }).catch((err) => {
                setError(err.response.data ?? err.message)
              })
            }
          }}>
            {error && <Error error={error} />}
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
            )}

            <div className="flex items-start gap-3 px-1 mt-1">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-card cursor-pointer transition-all"
                />
              </div>
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
                I agree to the <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
              </label>
            </div>

            <div className="py-2">
              <Captcha onVerify={setIsVerified} />
            </div>

            <Button
              type="submit"
              disabled={!acceptedTerms || !isVerified}
              className={`w-full py-6 rounded-full font-geist font-semibold tracking-wide text-base mt-2 transition-all duration-300 ${
                acceptedTerms && isVerified
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
              }`}
            >
              {mode === "login" ? "Access Command Center" : "Begin Mission"}
            </Button>

            {mode === "signup" && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Includes a <span className="text-primary font-semibold">3-day free trial</span> of the Pro Tier. No credit card required.
              </p>
            )}
          </form>

          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue as</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Link href="/dashboard">
            <Button variant="outline" className="w-full py-6 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30">
              Continue as Guest (Limited Access)
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
