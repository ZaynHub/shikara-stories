import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ImageOff, Loader2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { loadGallery, type GalleryPhoto } from "@/lib/admin-data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Talib's Tour & Travels" },
      { name: "description", content: "Photo gallery from Kashmir — Srinagar, Gulmarg, Pahalgam, Sonamarg & houseboats." },
    ],
  }),
  component: GalleryPage,
});

// Unique gradient palettes per category — not repeated patterns
const CATEGORY_GRADIENTS: Record<string, string[]> = {
  "Dal Lake":   ["linear-gradient(135deg,#4A90C4,#0A1F44)", "linear-gradient(160deg,#0A1F44,#4A90C4,#C9A84C)"],
  "Houseboat":  ["linear-gradient(135deg,#0A1F44,#2D3E6B)", "linear-gradient(150deg,#2D3E6B,#C9A84C)"],
  "Mountains":  ["linear-gradient(125deg,#2D6A4F,#0A1F44)", "linear-gradient(160deg,#1a3d2f,#4A90C4)"],
  "Shikara":    ["linear-gradient(135deg,#C9A84C,#0A1F44)", "linear-gradient(145deg,#8B6914,#4A90C4)"],
  "Garden":     ["linear-gradient(130deg,#4A90C4,#2D6A4F)", "linear-gradient(155deg,#0A1F44,#C9A84C)"],
  "City":       ["linear-gradient(135deg,#374151,#0A1F44)", "linear-gradient(150deg,#0A1F44,#374151,#C9A84C)"],
  "Other":      ["linear-gradient(135deg,#0A1F44,#4A90C4)", "linear-gradient(145deg,#C9A84C,#0A1F44)"],
};

// Varied heights for masonry — cycles through intentionally non-uniform values
const HEIGHT_SEQUENCE = [260, 340, 200, 320, 280, 380, 220, 300, 360, 240, 310, 270];

function getGradient(cat: string, index: number) {
  const variants = CATEGORY_GRADIENTS[cat] || CATEGORY_GRADIENTS["Other"];
  return variants[index % variants.length];
}

function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    loadGallery().then((gallery) => {
      setPhotos(gallery);
      setLoading(false);
    });
  }, []);

  // Derive category list dynamically from stored photos
  const categories = ["All", ...Array.from(new Set(photos.map((p) => p.category))).sort()];
  const visible = filter === "All" ? photos : photos.filter((p) => p.category === filter);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % visible.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + visible.length) % visible.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, visible.length]);

  const current = lightbox !== null ? visible[lightbox] : null;

  return (
    <PageShell>
      <PageHero title="Kashmir Through Our Lens" subtitle="Real moments from real journeys" />

      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" /> Loading gallery…
          </div>
        ) : (
          <>
            {/* Filter tabs — only shown if gallery has photos */}
            {categories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {categories.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                    style={
                      filter === f
                        ? { background: "#0A1F44", color: "#fff" }
                        : { background: "#fff", border: "1px solid #e5e7eb", color: "#374151" }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {/* Empty state */}
            {visible.length === 0 && (
              <div className="text-center py-32">
                <ImageOff className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: "#0A1F44" }} />
                <p className="text-xl font-semibold text-gray-500">No photos yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  {filter === "All"
                    ? "Upload photos from the Admin → Gallery panel to see them here."
                    : `No photos in the "${filter}" category. Try "All" or upload more.`}
                </p>
              </div>
            )}

            {/* Masonry grid — uniquely varied column spans and heights */}
            {visible.length > 0 && (
              <div key={filter} className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 animate-fade-in">
                {visible.map((photo, i) => {
                  const h = HEIGHT_SEQUENCE[i % HEIGHT_SEQUENCE.length];
                  const bg = getGradient(photo.category, i);
                  return (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.08 }}
                      transition={{ delay: (i % 6) * 0.06, duration: 0.45 }}
                      onClick={() => setLightbox(i)}
                      style={{ height: h, marginBottom: 16 }}
                      className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer relative group shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                    >
                      {photo.url ? (
                        <img
                          src={photo.url}
                          alt={photo.caption || photo.category}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div style={{ background: bg }} className="w-full h-full" />
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                        {photo.caption && (
                          <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-2">{photo.caption}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] px-2.5 py-1 rounded-full font-bold" style={{ background: "#C9A84C", color: "#0A1F44" }}>{photo.category}</span>
                          <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/20 text-white font-semibold backdrop-blur-sm">View →</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(6,15,42,0.96)" }}
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            {visible.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! - 1 + visible.length) % visible.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Next */}
            {visible.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! + 1) % visible.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl"
              style={{ maxHeight: "80vh" }}
            >
              {current.url ? (
                <img src={current.url} alt={current.caption || current.category} className="w-full max-h-[80vh] object-contain rounded-3xl" />
              ) : (
                <div className="w-full aspect-[4/3] rounded-3xl" style={{ background: getGradient(current.category, lightbox!) }} />
              )}
              {/* Caption bar */}
              <div className="absolute bottom-0 left-0 right-0 px-6 py-4 rounded-b-3xl" style={{ background: "linear-gradient(to top, rgba(6,15,42,0.9), transparent)" }}>
                <div className="flex items-end justify-between text-white">
                  <div>
                    {current.caption && <div className="font-display text-xl font-bold">{current.caption}</div>}
                    <div className="text-xs opacity-70 mt-0.5 uppercase tracking-widest">{current.category}</div>
                  </div>
                  <div className="text-sm opacity-70">{lightbox! + 1} / {visible.length}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
