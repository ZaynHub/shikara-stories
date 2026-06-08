import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Talib's Tour & Travels" },
      { name: "description", content: "Photo gallery from Kashmir — Srinagar, Gulmarg, Pahalgam, Sonamarg & houseboats." },
    ],
  }),
  component: GalleryPage,
});

type Cat = "Srinagar" | "Gulmarg" | "Pahalgam" | "Sonamarg" | "Houseboats";
const filters = ["All", "Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Houseboats"] as const;

const palette: Record<Cat, string> = {
  Srinagar: "from-kashmir-blue to-navy",
  Gulmarg: "from-white via-kashmir-blue to-navy",
  Pahalgam: "from-emerald-brand to-emerald-deep",
  Sonamarg: "from-gold to-emerald-brand",
  Houseboats: "from-navy to-emerald-deep",
};

const items: { id: number; cat: Cat; h: number }[] = Array.from({ length: 24 }, (_, i) => {
  const cats: Cat[] = ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Houseboats"];
  return { id: i + 1, cat: cats[i % cats.length], h: [240, 320, 280, 360, 220, 300][i % 6] };
});

function GalleryPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = filter === "All" ? items : items.filter((x) => x.cat === filter);
  const [lightbox, setLightbox] = useState<number | null>(null);

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
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === f ? "bg-gradient-brand text-white shadow-lg" : "bg-white border border-border text-charcoal hover:border-emerald-brand"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div key={filter} className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 animate-fade-in">
          {visible.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: (i % 8) * 0.05, duration: 0.4 }}
              onClick={() => setLightbox(i)}
              style={{ height: it.h }}
              className={`mb-4 break-inside-avoid rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${palette[it.cat]} relative group shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500`}
            >
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 55%)" }} />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 rounded-full bg-white/90 text-charcoal text-xs font-bold">{it.cat}</span>
                <span className="px-2.5 py-1 rounded-full bg-gold text-charcoal text-xs font-bold">View →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }} className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
              <X className="w-6 h-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! - 1 + visible.length) % visible.length); }} className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! + 1) % visible.length); }} className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
              <ChevronRight className="w-7 h-7" />
            </button>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-4xl w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br ${palette[current.cat]} relative shadow-2xl`}
            >
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55), transparent 55%)" }} />
              <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-70">Kashmir</div>
                  <div className="font-display text-3xl font-bold">{current.cat}</div>
                </div>
                <div className="text-sm opacity-80">{lightbox! + 1} / {visible.length}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
