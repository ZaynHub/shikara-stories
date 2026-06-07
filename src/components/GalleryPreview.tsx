import { motion } from "framer-motion";

const photos = [
  { label: "Dal Lake", h: 280, hue: "from-kashmir-blue to-emerald-brand" },
  { label: "Gulmarg Snow", h: 360, hue: "from-slate-200 to-kashmir-blue" },
  { label: "Pahalgam Valley", h: 240, hue: "from-emerald-brand to-gold" },
  { label: "Shikara Ride", h: 320, hue: "from-kashmir-blue to-navy" },
  { label: "Tulip Garden", h: 260, hue: "from-pink-400 to-gold" },
  { label: "Betaab Valley", h: 380, hue: "from-emerald-brand to-kashmir-blue" },
  { label: "Sonamarg Meadow", h: 240, hue: "from-gold to-emerald-brand" },
  { label: "Mughal Gardens", h: 300, hue: "from-emerald-brand to-gold-soft" },
  { label: "Houseboat Night", h: 340, hue: "from-navy to-kashmir-blue" },
  { label: "Aru Valley", h: 260, hue: "from-emerald-deep to-gold" },
  { label: "Chinar Autumn", h: 280, hue: "from-orange-500 to-gold" },
  { label: "Yusmarg", h: 320, hue: "from-emerald-brand to-kashmir-blue" },
];

export default function GalleryPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-emerald-brand font-semibold">Gallery</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 text-charcoal">
            Kashmir Through <span className="text-gradient-brand">Our Lens</span>
          </h2>
        </motion.div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className={`relative break-inside-avoid rounded-2xl overflow-hidden bg-gradient-to-br ${p.hue} group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
              style={{ height: `${p.h}px` }}
            >
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-500 grid place-items-center">
                <span className="text-white font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 border border-white/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  View Photo
                </span>
              </div>
              <div className="absolute bottom-3 left-4 text-white font-display text-xl drop-shadow group-hover:scale-110 transition-transform origin-bottom-left duration-500">
                {p.label}
              </div>
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 -z-10" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#gallery" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-emerald-brand text-emerald-brand font-semibold hover:bg-emerald-brand hover:text-white transition-all duration-300">
            View Full Gallery →
          </a>
        </div>
      </div>
    </section>
  );
}
