import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { getDashboardCounts } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Admin" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ packages: 0, offers: 0, gallery: 0, enquiries: 0, newEnquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardCounts().then((c) => {
      setCounts(c);
      setLoading(false);
    });
  }, []);

  const stats = [
    { icon: "📦", label: "Total Packages",  value: counts.packages,     to: "/admin/packages" },
    { icon: "🏷️", label: "Active Offers",   value: counts.offers,       to: "/admin/offers" },
    { icon: "🖼️", label: "Gallery Photos",  value: counts.gallery,      to: "/admin/gallery-manager" },
    { icon: "📩", label: "New Enquiries",   value: counts.newEnquiries, badge: counts.enquiries + " total", to: "/admin/enquiries" },
  ];

  return (
    <AdminLayout>
      <h1
        className="font-bold"
        style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}
      >
        Welcome Back, Talib! 👋
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">Here's what's happening today.</p>

      {loading ? (
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={s.to as "/admin/packages"}
                className="block bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="text-2xl">{s.icon}</div>
                  {s.badge && <span className="text-[10px] font-semibold text-gray-400">{s.badge}</span>}
                </div>
                <div
                  className="mt-3 font-extrabold"
                  style={{ color: "#C9A84C", fontSize: 32, fontFamily: '"Playfair Display", serif' }}
                >
                  {s.value}
                </div>
                <div className="text-sm font-semibold mt-1" style={{ color: "#0A1F44" }}>{s.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-bold text-lg" style={{ color: "#0A1F44" }}>Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            to="/admin/packages"
            className="px-5 py-3 rounded-xl font-bold text-sm"
            style={{ background: "#C9A84C", color: "#0A1F44" }}
          >
            + Add Package
          </Link>
          <Link
            to="/admin/offers"
            className="px-5 py-3 rounded-xl font-bold text-sm border-2"
            style={{ borderColor: "#0A1F44", color: "#0A1F44" }}
          >
            + Add Offer
          </Link>
          <Link
            to="/admin/gallery-manager"
            className="px-5 py-3 rounded-xl font-bold text-sm border-2"
            style={{ borderColor: "#0A1F44", color: "#0A1F44" }}
          >
            + Upload Photo
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
