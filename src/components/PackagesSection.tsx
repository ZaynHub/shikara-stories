import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { loadPackages, loadSettings, type AdminPackage, DEFAULT_SETTINGS } from "@/lib/admin-data";

// Static fallback packages (shown if admin hasn't added any yet)
const FALLBACK_PACKAGES: AdminPackage[] = [
  {
    id: "f1", name: "Kashmir Classic", type: "Family", duration: "5D / 4N", price: 12999,
    shortDescription: "The perfect family escape through Kashmir's most iconic destinations.",
    itinerary: "Day 1: Arrival Srinagar • Day 2: Dal Lake & Mughal Gardens • Day 3: Gulmarg Gondola • Day 4: Pahalgam Betaab Valley • Day 5: Departure",
    inclusions: "Deluxe houseboat stay, Shikara ride, All transfers, Breakfast daily",
    exclusions: "Airfare, Lunch & Dinner, Personal expenses",
    image: "", active: true, bestSeller: true, createdAt: 0,
  },
  {
    id: "f2", name: "Romantic Honeymoon", type: "Honeymoon", duration: "6D / 5N", price: 18999,
    shortDescription: "A magical honeymoon crafted for two in paradise.",
    itinerary: "Day 1: Arrival & Houseboat check-in • Day 2: Candle-lit Shikara dinner • Day 3: Gulmarg • Day 4: Pahalgam • Day 5: Sonamarg • Day 6: Departure",
    inclusions: "Luxury houseboat suite, Private cab, Candle-lit dinner, Breakfast daily",
    exclusions: "Airfare, Lunch, Personal expenses",
    image: "", active: true, bestSeller: false, createdAt: 0,
  },
  {
    id: "f3", name: "Kashmir Adventure Trek", type: "Adventure", duration: "7D / 6N", price: 15999,
    shortDescription: "Trek through breathtaking Himalayan trails and camp under stars.",
    itinerary: "Day 1: Arrival • Day 2: Acclimatisation • Day 3-5: Tarsar Marsar Trek • Day 6: Return to Srinagar • Day 7: Departure",
    inclusions: "Expert guide, Camping gear, All meals on trek, Transfers",
    exclusions: "Airfare, Personal trekking gear, Insurance",
    image: "", active: true, bestSeller: false, createdAt: 0,
  },
  {
    id: "f4", name: "Family Kashmir Special", type: "Family", duration: "5D / 4N", price: 10999,
    shortDescription: "Kid-friendly itinerary packed with fun and memories.",
    itinerary: "Day 1: Srinagar • Day 2: Dal Lake Shikara • Day 3: Gulmarg Gondola • Day 4: Pahalgam • Day 5: Departure",
    inclusions: "Comfort hotel, Gondola ride, All transfers, Breakfast",
    exclusions: "Airfare, Lunch & Dinner",
    image: "", active: true, bestSeller: false, createdAt: 0,
  },
  {
    id: "f5", name: "Pilgrimage Tour", type: "Pilgrimage", duration: "4D / 3N", price: 8999,
    shortDescription: "A spiritually enriching tour of Kashmir's sacred sites.",
    itinerary: "Day 1: Hazratbal Shrine • Day 2: Shankaracharya Temple • Day 3: Charar-e-Sharief • Day 4: Departure",
    inclusions: "Guided tour, Hotel, Transfers, Breakfast",
    exclusions: "Airfare, Lunch & Dinner",
    image: "", active: true, bestSeller: false, createdAt: 0,
  },
  {
    id: "f6", name: "Kashmir Budget Package", type: "Budget", duration: "3D / 2N", price: 6999,
    shortDescription: "See the best of Srinagar without breaking the bank.",
    itinerary: "Day 1: Dal Lake & Mughal Gardens • Day 2: Local Bazaar & Shikara Ride • Day 3: Departure",
    inclusions: "Budget hotel, Breakfast, Local cab transfers",
    exclusions: "Airfare, Lunch & Dinner, Entry fees",
    image: "", active: true, bestSeller: false, createdAt: 0,
  },
];

const HUE_MAP: Record<string, string> = {
  Honeymoon: "from-pink-400 to-[#C9A84C]",
  Family:    "from-[#4A90C4] to-[#0A1F44]",
  Adventure: "from-[#2D6A4F] to-[#4A90C4]",
  Pilgrimage:"from-[#C9A84C] to-[#0A1F44]",
  Budget:    "from-[#0A1F44] to-[#4A90C4]",
  Luxury:    "from-[#7C3AED] to-[#C9A84C]",
};

const FILTERS = ["All", "Honeymoon", "Family", "Adventure", "Pilgrimage", "Budget", "Luxury"] as const;
type Filter = (typeof FILTERS)[number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function PackagesSection() {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [whatsapp, setWhatsapp] = useState(DEFAULT_SETTINGS.whatsapp);

  useEffect(() => {
    Promise.all([loadPackages(), loadSettings()]).then(([pkgs, settings]) => {
      const active = pkgs.filter((p) => p.active);
      setPackages(active.length > 0 ? active : FALLBACK_PACKAGES);
      setWhatsapp(settings.whatsapp);
    });
  }, []);

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
        {FILTERS.map((f) => (
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

      <div key={filter} className="grid md:grid-cols-3 gap-7 animate-fade-in">
        {visible.map((p, i) => {
          const hue = HUE_MAP[p.type] || "from-[#0A1F44] to-[#4A90C4]";
          return (
            <motion.article
              key={p.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
              className="tilt-card group rounded-2xl bg-white border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-shadow duration-500"
            >
              <div className={`relative h-48 bg-gradient-to-br ${hue}`}>
                {p.image && <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55), transparent 55%)" }} />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold text-charcoal text-xs font-bold shadow">
                  {p.type}
                </span>
                {p.bestSeller && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold shadow" style={{ background: "#C9A84C", color: "#0A1F44" }}>
                    Best Seller
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-2xl text-charcoal">{p.name}</h3>
                <div className="text-xs text-muted-foreground mt-1">{p.duration}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold" style={{ color: "#C9A84C" }}>₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-muted-foreground">/person</span>
                </div>
                {p.shortDescription && (
                  <p className="text-sm text-charcoal/70 mt-2 line-clamp-2">{p.shortDescription}</p>
                )}
                <div className="mt-6 flex gap-3">
                  <a
                    href={`https://wa.me/${whatsapp}?text=Hi! I'm interested in the ${encodeURIComponent(p.name)} package.`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 rounded-full text-sm font-semibold text-center transition-colors border-2"
                    style={{ borderColor: "#0A1F44", color: "#0A1F44" }}
                  >
                    Enquire
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}?text=I want to book the ${encodeURIComponent(p.name)} package!`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 rounded-full text-sm font-bold btn-3d hover:-translate-y-0.5 transition-transform text-center"
                    style={{ background: "#C9A84C", color: "#0A1F44" }}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <a href="/kashmir-tours" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold btn-3d hover:-translate-y-1 transition-transform" style={{ background: "#0A1F44" }}>
          View All Packages →
        </a>
      </div>
    </section>
  );
}
