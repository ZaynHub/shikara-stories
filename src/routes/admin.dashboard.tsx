import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  PACKAGES_KEY,
  OFFERS_KEY,
  GALLERY_KEY,
  ENQUIRIES_KEY,
  countKey,
} from "@/lib/admin-packages";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Admin" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ packages: 0, offers: 0, gallery: 0, enquiries: 0 });

  useEffect(() => {
    setCounts({
      packages: countKey(PACKAGES_KEY),
      offers: countKey(OFFERS_KEY),
      gallery: countKey(GALLERY_KEY),
      enquiries: countKey(ENQUIRIES_KEY),
    });
  }, []);

  const stats = [
    { icon: "📦", label: "Total Packages", value: counts.packages },
    { icon: "🏷️", label: "Active Offers", value: counts.offers },
    { icon: "🖼️", label: "Gallery Photos", value: counts.gallery },
    { icon: "📩", label: "New Enquiries", value: counts.enquiries },
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

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm"
          >
            <div className="text-2xl">{s.icon}</div>
            <div
              className="mt-3 font-extrabold"
              style={{ color: "#C9A84C", fontSize: 32, fontFamily: '"Playfair Display", serif' }}
            >
              {s.value}
            </div>
            <div className="text-sm font-semibold mt-1" style={{ color: "#0A1F44" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

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
