import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, ImagePlus, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { type AdminOffer, loadOffers, saveOffer, updateOffer, deleteOffer } from "@/lib/admin-data";
import { uploadImage } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/offers")({
  head: () => ({ meta: [{ title: "Offers — Admin" }, { name: "robots", content: "noindex" }] }),
  component: OffersManager,
});

const emptyForm = (): Omit<AdminOffer, "id" | "createdAt"> => ({
  title: "", discount: "", validUntil: "", description: "", bannerImage: "", active: true,
});

function OffersManager() {
  const [offers, setOffers] = useState<AdminOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Omit<AdminOffer, "id" | "createdAt"> & { id?: string }) | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadOffers().then((data) => { setOffers(data); setLoading(false); });
  }, []);

  const openAdd = () => { setEditing(emptyForm()); setIsNew(true); };
  const openEdit = (o: AdminOffer) => { setEditing({ ...o }); setIsNew(false); };

  const onSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.discount.trim()) { toast.error("Title and discount are required!"); return; }
    setSaving(true);
    if (isNew) {
      const created = await saveOffer(editing);
      if (created) { setOffers((prev) => [created, ...prev]); toast.success("Offer added! 🏷️"); }
      else toast.error("Failed to add offer");
    } else if (editing.id) {
      const updated = await updateOffer(editing.id, editing);
      if (updated) { setOffers((prev) => prev.map((o) => o.id === editing.id ? updated : o)); toast.success("Offer updated! ✅"); }
      else toast.error("Failed to update offer");
    }
    setSaving(false);
    setEditing(null);
  };

  const onToggle = async (id: string, current: boolean) => {
    const updated = await updateOffer(id, { active: !current });
    if (updated) setOffers((prev) => prev.map((o) => o.id === id ? updated : o));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const ok = await deleteOffer(deleteId);
    if (ok) { setOffers((prev) => prev.filter((o) => o.id !== deleteId)); toast.success("Offer deleted! 🗑️"); }
    else toast.error("Failed to delete");
    setDeleteId(null);
  };

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadImage(file, "offers");
    setUploading(false);
    e.target.value = "";
    if (url) setEditing({ ...editing, bannerImage: url });
    else toast.error("Image upload failed");
  };

  const deleteTarget = offers.find((o) => o.id === deleteId);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div>
          <h1 className="font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}>Offers & Deals</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage seasonal discounts and special banners</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#C9A84C", color: "#0A1F44" }}>
          <Plus className="w-4 h-4" /> Add Offer
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🏷️</div>
          <p className="font-semibold text-gray-600 text-lg">No offers yet</p>
          <button onClick={openAdd} className="mt-5 px-6 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#C9A84C", color: "#0A1F44" }}>Add Your First Offer</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {offers.map((offer) => (
              <motion.div key={offer.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {offer.bannerImage ? (
                  <div className="h-36 overflow-hidden"><img src={offer.bannerImage} alt="" className="w-full h-full object-cover" /></div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-4xl" style={{ background: "#F0F4FF" }}>🏷️</div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1" style={{ background: "#FEF3C7", color: "#78350F" }}>{offer.discount} OFF</span>
                      <h3 className="font-bold text-base" style={{ color: "#0A1F44" }}>{offer.title}</h3>
                      {offer.validUntil && <p className="text-xs text-gray-400 mt-0.5">Valid till {new Date(offer.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>}
                      {offer.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{offer.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => onToggle(offer.id, offer.active)}
                      className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-colors"
                      style={{ background: offer.active ? "#DCFCE7" : "#F3F4F6", color: offer.active ? "#14532D" : "#6B7280" }}>
                      {offer.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      {offer.active ? "Active" : "Inactive"}
                    </button>
                    <button onClick={() => openEdit(offer)} className="ml-auto p-2 rounded-lg hover:bg-gray-50 text-gray-500"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(offer.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44" }}>{isNew ? "Add New Offer" : "Edit Offer"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-semibold text-gray-700">Offer Title *</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g. Summer Kashmir Special" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Discount *</label>
                  <input value={editing.discount} onChange={(e) => setEditing({ ...editing, discount: e.target.value })} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g. 30% or ₹5000" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Valid Until</label>
                  <input type="date" value={editing.validUntil} onChange={(e) => setEditing({ ...editing, validUntil: e.target.value })} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Banner Image (optional)</label>
                <div className="mt-1">
                  {editing.bannerImage ? (
                    <div className="relative rounded-xl overflow-hidden h-32">
                      <img src={editing.bannerImage} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setEditing({ ...editing, bannerImage: "" })} className="absolute top-2 right-2 bg-white/90 rounded-full p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <button onClick={() => imgRef.current?.click()} disabled={uploading}
                      className="w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                      {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                      <span className="text-xs">{uploading ? "Uploading…" : "Upload Banner"}</span>
                    </button>
                  )}
                  <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={pickImage} />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setEditing({ ...editing, active: !editing.active })} className="w-11 h-6 rounded-full flex items-center px-0.5 transition-colors" style={{ background: editing.active ? "#C9A84C" : "#D1D5DB" }}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${editing.active ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{editing.active ? "Active (visible on site)" : "Inactive (hidden)"}</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border font-semibold text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={onSave} disabled={saving || uploading} className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: "#C9A84C", color: "#0A1F44" }}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : (isNew ? "Add Offer" : "Save Changes")}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this offer?</AlertDialogTitle>
            <AlertDialogDescription>"{deleteTarget?.title}" will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">Yes, Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
