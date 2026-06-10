import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({ meta: [{ title: "Enquiries — Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AdminLayout>
      <h1 className="font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}>Enquiries</h1>
      <p className="text-muted-foreground mt-2">Coming soon — view and respond to traveller messages.</p>
    </AdminLayout>
  ),
});
