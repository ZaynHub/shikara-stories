import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/offers")({
  head: () => ({ meta: [{ title: "Offers — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AdminLayout>
      <h1 className="font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}>Offers</h1>
      <p className="text-muted-foreground mt-2">Coming soon — manage seasonal deals and discount banners.</p>
    </AdminLayout>
  ),
});
