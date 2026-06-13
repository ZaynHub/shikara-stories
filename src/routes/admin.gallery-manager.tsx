import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Trash2, Plus, FolderPlus, X, FolderOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  type GalleryPhoto,
  loadGallery, saveGalleryPhoto, deleteGalleryPhoto,
  loadGalleryCategories, addGalleryCategory, deleteGalleryCategory,
} from "@/lib/admin-data";
import { uploadImage } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/gallery-manager")({
  head: () => ({ meta: [{ title: "Gallery — Admin" }, { name: "robots", content: "noindex" }] }),
  component: GalleryManager,
});

const DEFAULT_CATEGORIES = ["Dal Lake", "Houseboat", "Mountains", "Shikara", "Garden", "City", "Other"];

function GalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ caption: "", category: "", preview: "" });
  const [pendingUrl, setPendingUrl] = useState<string>("");
  const [filterCat, setFilterCat] = useState("All");
  const [catModal, setCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [deleteCat, setDeleteCat] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([loadGallery(), loadGalleryCategories()]).then(([gallery, cats]) => {
      setPhotos(gallery);
      const c = cats.length > 0 ? cats : DEFAULT_CATEGORIES;
      setCategories(c);
      setForm((f) => ({ ...f, category: c[0] || "Other" }));
      setLoading(false);
    });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, "gallery");
    setUploading(false);
    e.target.value = "";
    if (!url) { toast.error("Could not upload image"); return; }
    setPendingUrl(url);
    setForm((f) => ({ ...f, preview: url }));
    setModalOpen(true);
  };

  const savePhoto = async () => {
    if (!pendingUrl) return;
    const photo = await saveGalleryPhoto({ url: pendingUrl, caption: form.caption, category: form.category });
    if (photo) {
      setPhotos((prev) => [photo, ...prev]);
      toast.success("Photo added to gallery! 🖼️");
    } else toast.error("Failed to save photo");
    setModalOpen(false);
    setPendingUrl("");
    setForm({ caption: "", category: categories[0] || "Other", preview: "" });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const ok = await deleteGalleryPhoto(deleteId);
    if (ok) { setPhotos((prev) => prev.filter((p) => p.id !== deleteId)); toast.success("Photo removed 🗑️"); }
    else toast.error("Failed to delete photo");
    setDeleteId(null);
  };

  const handleAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    if (categories.includes(name)) { toast.error("Category already exists"); return; }
    const ok = await addGalleryCategory(name);
    if (ok) { setCategories((prev) => [...prev, name]); setNewCatName(""); toast.success(`Section "${name}" added ✅`); }
    else toast.error("Failed to add category");
  };

  const handleDeleteCategory = async (cat: string) => {
    const ok = await deleteGalleryCategory(cat);
    if (ok) {
      setCategories((prev) => prev.filter((c) => c !== cat));
      setPhotos((prev) => prev.map((p) => p.category === cat ? { ...p, category: "Other" } : p));
      if (filterCat === cat) setFilterCat("All");
      setDeleteCat(null);
      toast.success(`Section "${cat}" removed`);
    } else toast.error("Failed to remove category");
  };

  const deleteTarget = photos.find((p) => p.id === deleteId);
  const visible = filterCat === "All" ? photos : photos.filter((p) => p.category === filterCat);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h1 className="font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}>Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">{photos.length} photo{photos.length !== 1 ? "s" : ""} · {categories.length} section{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCatModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2" style={{ borderColor: "#0A1F44", color: "#0A1F44", background: "#fff" }}>
            <FolderPlus className="w-4 h-4" /> Manage Sections
          </button>
          <button onClick={() => imgRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#C9A84C", color: "#0A1F44" }}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {uploading ? "Uploading…" : "Add Photo"}
          </button>
        </div>
        <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {["All", ...categories].map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={filterCat === cat ? { background: "#0A1F44", color: "#fff" } : { background: "#F0F4FF", color: "#0A1F44" }}>
            {cat} {cat !== "All" && `(${photos.filter((p) => p.category === cat).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading gallery…
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="font-semibold text-gray-600 text-lg">{filterCat === "All" ? "Gallery is empty" : `No photos in "${filterCat}" yet`}</p>
          <button onClick={() => imgRef.current?.click()} className="mt-5 px-6 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#C9A84C", color: "#0A1F44" }}>
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence>
            {visible.map((photo) => (
              <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="relative rounded-2xl overflow-hidden group aspect-square bg-gray-100">
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <button onClick={() => setDeleteId(photo.id)} className="self-end w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    {photo.caption && <p className="text-white text-xs font-semibold line-clamp-2">{photo.caption}</p>}
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">{photo.category}</span>
                  </div>
                </div>
                <button onClick={() => setDeleteId(photo.id)} className="md:hidden absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow">
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Photo Modal */}
      <Dialog open={modalOpen} onOpenChange={(o) => !o && setModalOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44" }}>Add Photo</DialogTitle></DialogHeader>
          {form.preview && <div className="rounded-xl overflow-hidden h-48"><img src={form.preview} alt="" className="w-full h-full object-cover" /></div>}
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-sm font-semibold text-gray-700">Caption (optional)</label>
              <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="e.g. Sunrise at Dal Lake" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Section / Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] bg-white">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border font-semibold text-sm text-gray-600">Cancel</button>
              <button onClick={savePhoto} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#C9A84C", color: "#0A1F44" }}>Save Photo</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Sections Modal */}
      <Dialog open={catModal} onOpenChange={(o) => !o && setCatModal(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44" }}>
              <FolderOpen className="inline w-5 h-5 mr-2 mb-0.5" />Manage Sections
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-gray-400 -mt-2 mb-3">Deleting a section moves its photos to "Other".</p>
          <div className="space-y-2 max-h-52 overflow-y-auto mb-4">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-100 bg-[#F8FAFC]">
                <span className="text-sm font-semibold text-gray-700">{cat}</span>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{photos.filter((p) => p.category === cat).length} photos</span>
                  <button onClick={() => setDeleteCat(cat)} className="w-6 h-6 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="New section name…" />
            <button onClick={handleAddCategory} className="px-4 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#C9A84C", color: "#0A1F44" }}>Add</button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCat} onOpenChange={(o) => !o && setDeleteCat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Remove "{deleteCat}" section?</AlertDialogTitle>
            <AlertDialogDescription>{photos.filter((p) => p.category === deleteCat).length} photo(s) will be moved to "Other".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCat && handleDeleteCategory(deleteCat)} className="bg-red-500 hover:bg-red-600 text-white">Yes, Remove Section</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Remove this photo?</AlertDialogTitle>
            <AlertDialogDescription>{deleteTarget?.caption || "This photo"} will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">Yes, Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
