import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Package, Tag, Image as ImageIcon, Inbox, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/talib-logo.png.asset.json";
import { isAdminLoggedIn, logoutAdmin } from "@/lib/admin-auth";

const NAV = [
  { to: "/admin/dashboard", label: "Overview", icon: Package, emoji: "📊" },
  { to: "/admin/packages", label: "Packages", icon: Package, emoji: "📦" },
  { to: "/admin/offers", label: "Offers", icon: Tag, emoji: "🏷️" },
  { to: "/admin/gallery-manager", label: "Gallery", icon: ImageIcon, emoji: "🖼️" },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox, emoji: "📩" },
  { to: "/admin/settings", label: "Settings", icon: Settings, emoji: "⚙️" },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate({ to: "/admin" });
    } else {
      setReady(true);
    }
  }, [navigate]);

  const onLogout = () => {
    logoutAdmin();
    toast.success("Logged out");
    navigate({ to: "/admin" });
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex">
      {/* Sidebar (desktop) */}
      <aside
        className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-40"
        style={{ background: "#0A1F44" }}
      >
        <div className="px-5 py-6 flex items-center gap-3 border-b border-white/10">
          <img src={logo.url} alt="Talib's" style={{ height: 56 }} className="w-auto object-contain rounded-lg" />
          <div className="leading-tight">
            <div className="text-white font-bold text-sm" style={{ fontFamily: '"Playfair Display", serif' }}>
              Talib's
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#C9A84C]">Admin</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? "#C9A84C" : "transparent",
                  color: active ? "#0A1F44" : "rgba(255,255,255,0.85)",
                }}
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={onLogout}
          className="m-3 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/85 hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-0">
        <div className="bg-white min-h-screen">
          <div className="p-6">{children}</div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t"
        style={{ background: "#0A1F44", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="grid grid-cols-5">
          {NAV.slice(1, 5).map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center py-2.5 gap-0.5"
                style={{ color: active ? "#C9A84C" : "rgba(255,255,255,0.7)" }}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center py-2.5 gap-0.5 text-white/70"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
