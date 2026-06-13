import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { loadGallery, type GalleryPhoto } from "@/lib/admin-data";

// Varied heights for an organic masonry feel
const HEIGHTS = [260, 340, 200, 320, 280, 380, 220, 300];

export default function GalleryPreview() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadGallery().then((gallery) => {
      setPhotos(gallery.slice(0, 6)); // show max 8 on homepage
      setLoaded(true);
    });
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: "#C9A84C" }}>Gallery</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 text-charcoal">
            Kashmir Through <span className="text-gradient-brand">Our Lens</span>
          </h2>
        </motion.div>

        {/* Empty state — clean, no fake cards */}
        {loaded && photos.length === 0 && (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-200">
            <ImageOff className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-400">No gallery photos yet</p>
            <p className="text-sm text-gray-300 mt-1">
              Upload photos from <strong>Admin → Gallery</strong> to showcase them here.
            </p>
          </div>
        )}

        {/* Real photo masonry — unique heights, no repeating patterns */}
        {photos.length > 0 && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {photos.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="relative break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gray-100 mb-4"
                style={{ height: HEIGHTS[i % HEIGHTS.length] }}
              >
                <img
                  src={p.url}
                  alt={p.caption || p.category}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 grid place-items-center">
                  <span className="text-white font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 border border-white/60 px-4 py-1.5 rounded-full backdrop-blur-sm text-sm">
                    View Photo
                  </span>
                </div>
                {(p.caption || p.category) && (
                  <div className="absolute bottom-3 left-4 right-4 text-white font-display text-base drop-shadow group-hover:scale-105 transition-transform origin-bottom-left duration-500 line-clamp-2">
                    {p.caption || p.category}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 font-semibold transition-all duration-300"
            style={{ borderColor: "#0A1F44", color: "#0A1F44" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#0A1F44";
              (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#0A1F44";
            }}
          >
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
