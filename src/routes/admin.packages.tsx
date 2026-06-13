import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  type AdminPackage, type PackageType,
  PACKAGE_TYPES, loadPackages, savePackage, updatePackage, deletePackage, typeColor,
} from "@/lib/admin-data";
import { uploadImage } from "@/lib/storage";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/packages")({
  head: () => ({ meta: [{ title: "Packages — Admin" }, { name: "robots", content: "noindex" }] }),
  component: PackagesManager,
});

const emptyForm = (): Omit<AdminPackage, "id" | "createdAt"> => ({
  name: "", type: "Family", price: 0, duration: "",
  shortDescription: "", itinerary: "", inclusions: "", exclusions: "",
  image: "", active: true, bestSeller: false,
});

function PackagesManager() {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Omit<AdminPackage, "id" | "createdAt"> & { id?: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPackages().then((pkgs) => { setPackages(pkgs); setLoading(false); });
  }, []);

  const onSave = async (form: Omit<AdminPackage, "id" | "createdAt"> & { id?: string }) => {
    setSaving(true);
    if (form.id) {
      const updated = await updatePackage(form.id, form);
      if (updated) {
        setPackages((prev) => prev.map((p) => p.id === form.id ? updated : p));
        toast.success("Package updated! ✅");
      } else toast.error("Failed to update package");
    } else {
      const created = await savePackage(form);
      if (created) {
        setPackages((prev) => [created, ...prev]);
        toast.success("Package added! ✅");
      } else toast.error("Failed to add package");
    }
    setSaving(false);
    setEditing(null);
  };

  const onToggleActive = async (id: string, current: boolean) => {
    const updated = await updatePackage(id, { active: !current });
    if (updated) setPackages((prev) => prev.map((p) => p.id === id ? updated : p));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const ok = await deletePackage(deleteId);
    if (ok) {
      setPackages((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Package deleted! 🗑️");
    } else toast.error("Failed to delete");
    setDeleteId(null);
  };

  const deleteTarget = useMemo(() => packages.find((p) => p.id === deleteId), [packages, deleteId]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}>
          Packages
        </h1>
        <button
          onClick={() => setEditing(emptyForm())}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: "#C9A84C", color: "#0A1F44" }}
        >
          <Plus className="w-4 h-4" /> Add New Package
        </button>
      </div>

      {loading ? (
        <div className="mt-10 space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : packages.length === 0 ? (
        <div className="mt-10 text-center py-16 bg-[#F6F7FB] rounded-2xl border border-dashed">
          <div className="text-4xl">📦</div>
          <p className="mt-3 font-semibold" style={{ color: "#0A1F44" }}>No packages yet</p>
          <p className="text-sm text-muted-foreground">Click "Add New Package" to create your first one.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead style={{ background: "#F6F7FB" }}>
                <tr className="text-left" style={{ color: "#0A1F44" }}>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((p) => {
                  const c = typeColor(p.type);
                  return (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-[60px] h-[60px] object-cover rounded-lg" />
                        ) : (
                          <div className="w-[60px] h-[60px] rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                            <ImagePlus className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="p-3 font-bold" style={{ color: "#0A1F44" }}>{p.name}</td>
                      <td className="p-3">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: c.bg, color: c.fg }}>
                          {p.type}
                        </span>
                      </td>
                      <td className="p-3 font-bold" style={{ color: "#C9A84C" }}>₹{p.price.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-charcoal/80">{p.duration}</td>
                      <td className="p-3"><Toggle on={p.active} onChange={() => onToggleActive(p.id, p.active)} /></td>
                      <td className="p-3 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => setEditing({ ...p })} className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-white" style={{ background: "#0A1F44" }} aria-label="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-white bg-red-600" aria-label="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden mt-6 space-y-3">
            {packages.map((p) => {
              const c = typeColor(p.type);
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-border p-3 flex gap-3">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-[60px] h-[60px] object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-[60px] h-[60px] rounded-lg bg-muted flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate" style={{ color: "#0A1F44" }}>{p.name}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: c.bg, color: c.fg }}>{p.type}</span>
                      <span className="font-bold text-sm" style={{ color: "#C9A84C" }}>₹{p.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.duration}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <Toggle on={p.active} onChange={() => onToggleActive(p.id, p.active)} />
                      <div className="flex gap-2">
                        <button onClick={() => setEditing({ ...p })} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-white" style={{ background: "#0A1F44" }}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-white bg-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <AnimatePresence>
        {editing && (
          <PackageModal
            initial={editing}
            saving={saving}
            onClose={() => setEditing(null)}
            onSave={onSave}
          />
        )}
      </AnimatePresence>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-colors"
      style={{ background: on ? "#16A34A" : "#CBD5E1" }}
    >
      <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}

function PackageModal({
  initial, saving, onClose, onSave,
}: {
  initial: Omit<AdminPackage, "id" | "createdAt"> & { id?: string };
  saving: boolean;
  onClose: () => void;
  onSave: (p: Omit<AdminPackage, "id" | "createdAt"> & { id?: string }) => void;
}) {
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onImage = async (file: File) => {
    setUploading(true);
    const url = await uploadImage(file, "packages");
    setUploading(false);
    if (url) update("image", url);
    else toast.error("Image upload failed");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.price <= 0) {
      toast.error("Name and price are required");
      return;
    }
    onSave(form);
  };

  const input = "w-full h-11 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20";
  const ta = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl p-0">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44" }}>
              {initial.id ? "Edit Package" : "Add New Package"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <Label>Package Name *</Label>
              <input className={input} value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Package Type</Label>
                <select className={input} value={form.type} onChange={(e) => update("type", e.target.value as PackageType)}>
                  {PACKAGE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label>Price Per Person (₹) *</Label>
                <input type="number" min={0} className={input} value={form.price || ""} onChange={(e) => update("price", Number(e.target.value))} required />
              </div>
            </div>
            <div>
              <Label>Duration</Label>
              <input className={input} placeholder="5 Days / 4 Nights" value={form.duration} onChange={(e) => update("duration", e.target.value)} />
            </div>
            <div>
              <Label>Short Description ({form.shortDescription.length}/200)</Label>
              <textarea rows={2} maxLength={200} className={ta} value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
            </div>
            <div>
              <Label>Full Itinerary (Day by Day)</Label>
              <textarea rows={4} className={ta} value={form.itinerary} onChange={(e) => update("itinerary", e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Inclusions</Label>
                <textarea rows={3} className={ta} value={form.inclusions} onChange={(e) => update("inclusions", e.target.value)} />
              </div>
              <div>
                <Label>Exclusions</Label>
                <textarea rows={3} className={ta} value={form.exclusions} onChange={(e) => update("exclusions", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Image</Label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="px-4 h-11 rounded-lg border-2 font-semibold text-sm inline-flex items-center gap-2"
                  style={{ borderColor: "#0A1F44", color: "#0A1F44" }}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                  {uploading ? "Uploading…" : "Upload"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && onImage(e.target.files[0])} />
                {form.image && <img src={form.image} alt="preview" className="w-16 h-16 rounded-lg object-cover" />}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#0A1F44" }}>
                <Toggle on={form.active} onChange={() => update("active", !form.active)} /> Active
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#0A1F44" }}>
                <Toggle on={form.bestSeller} onChange={() => update("bestSeller", !form.bestSeller)} /> Best Seller
              </label>
            </div>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="submit" disabled={saving || uploading}
                className="w-full font-bold rounded-xl py-3 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "#C9A84C", color: "#0A1F44" }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Package"}
              </button>
              <button type="button" onClick={onClose}
                className="w-full font-bold rounded-xl py-3 border-2"
                style={{ borderColor: "#0A1F44", color: "#0A1F44" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: "#0A1F44" }}>{children}</label>;
}
