import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import PageShell from "@/components/PageShell";
import logo from "@/assets/talib-logo.png.asset.json";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Login — Talib's Tour & Travels" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const inputCls =
    "w-full h-12 rounded-xl border border-border bg-white px-4 text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all";

  return (
    <PageShell>
      <section className="min-h-[85vh] flex items-center justify-center px-6 py-20 bg-gradient-to-br from-navy via-emerald-deep to-emerald-brand">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10"
        >
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="rounded-2xl overflow-hidden bg-navy ring-2 ring-gold/30 shadow-md">
              <img src={logo.url} alt="Talib's Tour & Travels" className="h-14 w-auto object-contain" />
            </div>
            <h1 className="mt-5 font-display text-2xl md:text-3xl text-navy font-bold text-center">
              Staff Login
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground text-center">
              Restricted area — authorized personnel only
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Email</label>
              <input type="email" placeholder="you@company.com" className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-charcoal transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-full font-bold text-navy btn-3d hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
              style={{ background: "#C9A84C" }}
            >
              <Lock className="w-4 h-4" /> Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-navy/80 hover:text-navy font-medium underline underline-offset-4 decoration-gold/50 hover:decoration-gold transition-colors">
              Forgot Password?
            </a>
          </div>

          <p className="text-[11px] text-center text-muted-foreground mt-6">
            Auth wiring coming soon — this is a placeholder login screen.
          </p>
        </motion.div>
      </section>
    </PageShell>
  );
}
