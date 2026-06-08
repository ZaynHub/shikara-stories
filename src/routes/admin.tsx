import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import PageShell from "@/components/PageShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Login — Talib's Tour & Travels" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  return (
    <PageShell>
      <section className="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-gradient-to-br from-cream to-white">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-border p-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-navy text-gold flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="mt-5 text-center font-display text-3xl text-navy font-bold">Admin Login</h1>
          <p className="text-center text-sm text-muted-foreground mt-2">Restricted area — staff only</p>
          <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email" className="w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:border-emerald-brand" />
            <input type="password" placeholder="Password" className="w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:border-emerald-brand" />
            <button className="w-full py-3.5 rounded-full bg-gradient-brand text-white font-bold btn-3d hover:-translate-y-0.5 transition-transform">
              Sign In
            </button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-5">Placeholder — auth wiring coming soon.</p>
        </motion.div>
      </section>
    </PageShell>
  );
}
