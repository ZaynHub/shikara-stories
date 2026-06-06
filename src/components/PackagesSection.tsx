import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type PkgType = "Honeymoon" | "Family" | "Adventure" | "Pilgrimage" | "Budget";

const packages: {
  name: string;
  type: PkgType;
  duration: string;
  price: string;
  unit: string;
  highlights: string[];
  hue: string;
  bestSeller?: boolean;
}[] = [
  { name: "Kashmir Classic", type: "Family", duration: "5D / 4N", price: "₹12,999", unit: "/person", highlights: ["Srinagar · Gulmarg · Pahalgam", "Deluxe houseboat stay", "Shikara ride included"], hue: "from-kashmir-blue to-emerald-brand", bestSeller: true },
  { name: "Romantic Kashmir Honeymoon", type: "Honeymoon", duration: "6D / 5N", price: "₹18,999", unit: "/couple", highlights: ["Candle-lit Shikara dinner", "Luxury houseboat suite", "Private cab throughout"], hue: "from-pink-500 to-gold" },
  { name: "Kashmir Adventure Trek", type: "Adventure", duration: "7D / 6N", price: "₹15,999", unit: "/person", highlights: ["Tarsar Marsar trek", "Camping under stars", "Expert local guide"], hue: "from-emerald-brand to-emerald-deep" },
  { name: "Family Kashmir Special", type: "Family", duration: "5D / 4N", price: "₹10,999", unit: "/person", highlights: ["Kid-friendly itinerary", "Gondola ride at Gulmarg", "Comfort hotels"], hue: "from-gold to-emerald-brand" },
  { name: "Kashmir Pilgrimage Tour", type: "Pilgrimage", duration: "4D / 3N", price: "₹8,999", unit: "/person", highlights: ["Hazratbal · Shankaracharya", "Charar-e-Sharief darshan", "Guided spiritual tour"], hue: "from-kashmir-blue to-navy" },
  { name: "Kashmir Budget Package", type: "Budget", duration: "3D / 2N", price: "₹6,999", unit: "/person", highlights: ["Srinagar sightseeing", "Budget hotel + breakfast", "Local cab transfers"], hue: "from-emerald-deep to-kashmir-blue" },
];

const filters = ["All", "Honeymoon", "Family", "Adventure", "Pilgrimage", "Budget"] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function PackagesSection() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = filter === "All" ? packages : packages.filter((p) => p.type === filter);

  return (
    <section id="packages" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-display text-4xl md:text-5xl text-charcoal">
          Our <span className="text-gradient-brand">Kashmir Packages</span>
        </h2>
        <p className="mt-3 text-muted-foreground">Handcrafted experiences for every traveler</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              filter === f
                ? "bg-gradient-brand text-white shadow-lg"
                : "bg-white border border-border text-charcoal hover:border-emerald-brand"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-7">
        {visible.map((p, i) => (
          <motion.article
            key={p.name}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
            className="tilt-card group rounded-2xl bg-white border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-shadow duration-500"
          >
            <div className={`relative h-48 bg-gradient-to-br ${p.hue}`}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55), transparent 55%)" }} />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold text-charcoal text-xs font-bold shadow">
                {p.type}
              </span>
              {p.bestSeller && (
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-brand text-white text-xs font-bold shadow">
                  Best Seller
                </span>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-display text-2xl text-charcoal">{p.name}</h3>
              <div className="text-xs text-muted-foreground mt-1">{p.duration}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl text-emerald-brand font-bold">{p.price}</span>
                <span className="text-xs text-muted-foreground">{p.unit}</span>
              </div>
              <ul className="mt-4 space-y-2 flex-1">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-charcoal/80">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-brand shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-2.5 rounded-full border-2 border-emerald-brand text-emerald-brand text-sm font-semibold hover:bg-emerald-brand hover:text-white transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2.5 rounded-full bg-gold text-charcoal text-sm font-bold btn-3d hover:-translate-y-0.5 transition-transform">
                  Book Now
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-14 text-center">
        <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-brand text-white font-bold btn-3d hover:-translate-y-1 transition-transform">
          View All Packages →
        </button>
      </div>
    </section>
  );
}
