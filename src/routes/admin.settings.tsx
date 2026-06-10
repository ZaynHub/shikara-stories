import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AdminLayout>
      <h1 className="font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}>Settings</h1>
      <p className="text-muted-foreground mt-2">Coming soon — site config, contact details, branding.</p>
    </AdminLayout>
  ),
});
