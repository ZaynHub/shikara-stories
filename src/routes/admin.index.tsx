import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/talib-logo.png.asset.json";
import { isAdminLoggedIn, loginAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Login — Talib's Tour & Travels" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const controls = useAnimationControls();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) navigate({ to: "/admin/dashboard" });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    if (loginAdmin(email, password)) {
      toast.success("Welcome back, Talib! 👋");
      navigate({ to: "/admin/dashboard" });
    } else {
      toast.error("Invalid credentials. Try again.");
      controls.start({
        x: [0, -10, 10, -8, 8, -4, 4, 0],
        transition: { duration: 0.5 },
      });
    }
  };

  const inputCls =
    "w-full h-12 rounded-xl border border-border bg-white px-4 text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all";

  return (
    <section
      className="min-h-[100vh] flex items-center justify-center px-6 py-20"
      style={{ background: "linear-gradient(135deg, #0A1F44 0%, #1d3a6e 50%, #4A90C4 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl"
        style={{ padding: "48px 40px" }}
      >
        <div className="flex flex-col items-center">
          <img src={logo.url} alt="Talib's Tour & Travels" style={{ height: 80 }} className="w-auto object-contain" />
          <h1
            className="mt-5 text-center font-bold"
            style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}
          >
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground text-center">
            Admin Panel — Talib's Tour & Travels
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@talibs.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading}
            className="w-full font-bold active:translate-y-0.5 transition-all duration-150 disabled:opacity-70"
            style={{
              background: "#C9A84C",
              color: "#0A1F44",
              borderRadius: 12,
              padding: "14px 0",
              fontSize: 15,
            }}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-navy hover:underline underline-offset-4 transition-colors"
          >
            Forgot Password?
          </a>
        </div>

        <p className="text-[11px] text-center text-muted-foreground mt-6">
          🔒 Secure Admin Access Only
        </p>
      </motion.div>
    </section>
  );
}
