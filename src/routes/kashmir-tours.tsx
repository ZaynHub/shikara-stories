import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, MessageCircle, Loader2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import {
  loadPackages, loadSettings, DEFAULT_SETTINGS,
  type AdminPackage, type PackageType,
} from "@/lib/admin-data";

export const Route = createFileRoute("/kashmir-tours")({
  head: () => ({
    meta: [
      { title: "Kashmir Tour Packages — Talib's Tour & Travels" },
      { name: "description", content: "Curated Kashmir tour packages: Honeymoon, Family, Adventure, Pilgrimage, Budget & Luxury trips." },
    ],
  }),
  component: KashmirToursPage,
});

// Static fallback packages — shown if no packages in DB yet
const FALLBACK_PACKAGES: AdminPackage[] = [
  {
    id: "seed-1", name: "Kashmir Classic", type: "Family", price: 12999, duration: "5D / 4N",
    shortDescription: "The perfect family escape through Kashmir's most iconic destinations.",
    itinerary: "Day 1: Arrive Srinagar, Shikara ride, Houseboat check-in\nDay 2: Gulmarg Gondola & snow activities\nDay 3: Pahalgam — Aru, Betaab & Chandanwari valleys\nDay 4: Srinagar — Mughal gardens, local markets, Hazratbal\nDay 5: Airport drop with sweet memories",
    inclusions: "Accommodation in deluxe hotels & houseboat\nAll transfers in private cab\nDaily breakfast & dinner\nAll sightseeing as per itinerary\nPermits & taxes",
    exclusions: "Airfare\nPersonal expenses\nPony / sledge rides\nLunch\nTravel insurance",
    image: "", active: true, bestSeller: true, createdAt: 1,
  },
  {
    id: "seed-2", name: "Romantic Honeymoon", type: "Honeymoon", price: 18999, duration: "6D / 5N",
    shortDescription: "A magical honeymoon crafted for two in paradise.",
    itinerary: "Day 1: Royal houseboat suite, candle-lit dinner\nDay 2: Gulmarg Gondola Phase 1 & 2\nDay 3: Pahalgam — riverside walks\nDay 4: Sonamarg — Thajiwas glacier\nDay 5: Floating market & Mughal gardens\nDay 6: Airport transfer",
    inclusions: "Luxury houseboat suite\nCandle-lit dinner\nPrivate cab\nFlower decoration\nDaily breakfast & dinner",
    exclusions: "Airfare\nLunch\nPersonal expenses\nSpa & extra activities",
    image: "", active: true, bestSeller: false, createdAt: 2,
  },
  {
    id: "seed-3", name: "Adventure Trek", type: "Adventure", price: 15999, duration: "7D / 6N",
    shortDescription: "Trek through breathtaking Himalayan trails and camp under stars.",
    itinerary: "Day 1: Srinagar arrival — briefing & gear check\nDay 2: Drive to Aru — acclimatisation walk\nDay 3-5: Tarsar Marsar Trek — camping under alpine stars\nDay 6: Return to Srinagar — rest & celebration dinner\nDay 7: Airport drop",
    inclusions: "Certified trek leader\nCamping equipment\nAll meals on trek\nPermits\nFirst-aid",
    exclusions: "Personal gear\nAirfare\nInsurance",
    image: "", active: true, bestSeller: false, createdAt: 3,
  },
  {
    id: "seed-4", name: "Family Special", type: "Family", price: 10999, duration: "5D / 4N",
    shortDescription: "Kid-friendly itinerary packed with fun and memories.",
    itinerary: "Day 1: Srinagar arrival — houseboat check-in\nDay 2: Gulmarg Gondola for the whole family\nDay 3: Pahalgam family picnic in kid-friendly valleys\nDay 4: Mughal Gardens — Shalimar, Nishat, Chashma Shahi\nDay 5: Airport drop",
    inclusions: "Kid-friendly hotels\nPrivate cab\nBreakfast & dinner\nAll sightseeing",
    exclusions: "Airfare\nLunch\nPony rides",
    image: "", active: true, bestSeller: false, createdAt: 4,
  },
  {
    id: "seed-5", name: "Pilgrimage Tour", type: "Pilgrimage", price: 8999, duration: "4D / 3N",
    shortDescription: "A spiritually enriching tour of Kashmir's sacred sites.",
    itinerary: "Day 1: Srinagar arrival — Hazratbal Shrine darshan\nDay 2: Shankaracharya Temple & Charar-e-Sharief\nDay 3: Local shrines — guided spiritual tour\nDay 4: Airport drop",
    inclusions: "3-star hotel stay\nPrivate cab\nBreakfast & dinner\nSpiritual guide",
    exclusions: "Airfare\nDonations\nLunch",
    image: "", active: true, bestSeller: false, createdAt: 5,
  },
  {
    id: "seed-6", name: "Budget Getaway", type: "Budget", price: 6999, duration: "3D / 2N",
    shortDescription: "See the best of Srinagar without breaking the bank.",
    itinerary: "Day 1: Srinagar arrival — budget hotel check-in, Shikara ride\nDay 2: Mughal gardens & local markets\nDay 3: Airport drop",
    inclusions: "Budget hotel\nBreakfast\nCab transfers\nShikara ride",
    exclusions: "Airfare\nDinner\nPersonal expenses",
    image: "", active: true, bestSeller: false, createdAt: 6,
  },
  {
    id: "seed-7", name: "Luxury Kashmir", type: "Luxury", price: 39999, duration: "7D / 6N",
    shortDescription: "The finest 5-star Kashmir experience, end to end.",
    itinerary: "Day 1: 5★ welcome — royal suite & welcome dinner\nDay 2: Gulmarg — private gondola booking\nDay 3: Heritage houseboat premier suite\nDay 4: Pahalgam luxury resort\nDay 5: Sonamarg — private guide & gourmet lunch\nDay 6: Srinagar — spa & shopping\nDay 7: Royal farewell — airport in luxury sedan",
    inclusions: "5-star luxury hotels\nLuxury sedan\nAll meals\nPrivate guide\nSpa session",
    exclusions: "Airfare\nAlcohol\nPersonal shopping",
    image: "", active: true, bestSeller: false, createdAt: 7,
  },
];

const HUE_MAP: Record<PackageType, string> = {
  Honeymoon:  "from-pink-400 to-[#C9A84C]",
  Family:     "from-[#4A90C4] to-[#0A1F44]",
  Adventure:  "from-[#2D6A4F] to-[#0A1F44]",
  Pilgrimage: "from-[#C9A84C] to-[#0A1F44]",
  Budget:     "from-[#0A1F44] to-[#4A90C4]",
  Luxury:     "from-[#C9A84C] to-[#7C3AED]",
};

const FILTERS = ["All", "Honeymoon", "Family", "Adventure", "Pilgrimage", "Budget", "Luxury"] as const;
type Filter = (typeof FILTERS)[number];

function parseLines(text: string) {
  return text.split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
}
function parseItinerary(text: string) {
  return text.split("\n").map((l, i) => {
    const m = l.match(/^(Day\s+[\d\-]+):\s*(.+)$/i);
    if (m) return { day: m[1], title: m[2] };
    return { day: `Day ${i + 1}`, title: l };
  }).filter((x) => x.title.trim());
}

function KashmirToursPage() {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<AdminPackage | null>(null);
  const [whatsapp, setWhatsapp] = useState(DEFAULT_SETTINGS.whatsapp);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadPackages(), loadSettings()]).then(([pkgs, settings]) => {
      const active = pkgs.filter((p) => p.active);
      setPackages(active.length > 0 ? active : FALLBACK_PACKAGES);
      setWhatsapp(settings.whatsapp);
      setLoading(false);
    });
  }, []);

  const visible = filter === "All" ? packages : packages.filter((p) => p.type === filter);

  // Keep modal closed when filter changes
  useEffect(() => setSelected(null), [filter]);

  return (
    <PageShell>
      <PageHero title="Kashmir Tour Packages" subtitle="Pick a journey crafted for your dreams" />

      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Filter tabs */}
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

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" /> Loading packages…
          </div>
        ) : (
          <>
            {visible.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-gray-500 font-semibold">No {filter} packages currently active</p>
                <p className="text-sm text-gray-400 mt-1">Check back soon or pick another category.</p>
              </div>
            )}

            <div key={filter} className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 animate-fade-in">
              {visible.map((p, i) => {
                const hue = HUE_MAP[p.type] || "from-[#0A1F44] to-[#4A90C4]";
                return (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="tilt-card group rounded-2xl bg-white border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-shadow duration-500"
                  >
                    <div className={`relative h-44 bg-gradient-to-br ${hue}`}>
                      {p.image && <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold text-charcoal text-xs font-bold shadow">{p.type}</span>
                      {p.bestSeller && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow" style={{ background: "#C9A84C", color: "#0A1F44" }}>
                          ⭐ Best Seller
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-display text-2xl text-charcoal">{p.name}</h3>
                      <div className="text-xs text-muted-foreground mt-1">{p.duration}</div>
                      {p.shortDescription && (
                        <p className="text-sm text-charcoal/70 mt-2 line-clamp-2">{p.shortDescription}</p>
                      )}
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="font-display text-3xl font-bold" style={{ color: "#C9A84C" }}>₹{p.price.toLocaleString("en-IN")}</span>
                        <span className="text-xs text-muted-foreground">/person</span>
                      </div>
                      <div className="mt-auto pt-5 flex gap-3">
                        <button
                          onClick={() => setSelected(p)}
                          className="flex-1 px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-colors hover:bg-[#0A1F44] hover:text-white"
                          style={{ borderColor: "#0A1F44", color: "#0A1F44" }}
                        >
                          View Details
                        </button>
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
          </>
        )}
      </section>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className={`relative h-44 bg-gradient-to-br ${HUE_MAP[selected.type] || "from-[#0A1F44] to-[#4A90C4]"} rounded-t-3xl`}>
                {selected.image && <img src={selected.image} alt={selected.name} className="absolute inset-0 w-full h-full object-cover rounded-t-3xl" />}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow"
                >
                  <X className="w-5 h-5 text-charcoal" />
                </button>
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-gold text-charcoal text-xs font-bold">{selected.type}</span>
                  <h3 className="font-display text-3xl font-bold mt-2">{selected.name}</h3>
                  <p className="text-sm opacity-90">{selected.duration} · ₹{selected.price.toLocaleString("en-IN")} /person</p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-7">
                {selected.shortDescription && (
                  <p className="text-muted-foreground">{selected.shortDescription}</p>
                )}

                {/* Itinerary */}
                {selected.itinerary && (
                  <div>
                    <h4 className="font-display text-xl text-navy font-bold mb-3">🗺️ Day-wise Itinerary</h4>
                    <ol className="space-y-2">
                      {parseItinerary(selected.itinerary).map((d, i) => (
                        <li key={i} className="flex gap-4 p-3.5 rounded-xl bg-[#F0F4FF] border border-[#E0E7FF]">
                          <div className="font-bold min-w-[70px] text-sm" style={{ color: "#C9A84C" }}>{d.day}</div>
                          <div className="text-sm text-charcoal">{d.title}</div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Inclusions & Exclusions */}
                <div className="grid md:grid-cols-2 gap-5">
                  {selected.inclusions && (
                    <div>
                      <h4 className="font-display text-lg text-navy font-bold mb-3">✅ Inclusions</h4>
                      <ul className="space-y-1.5">
                        {parseLines(selected.inclusions).map((x) => (
                          <li key={x} className="flex gap-2 text-sm">
                            <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#C9A84C" }} /> {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selected.exclusions && (
                    <div>
                      <h4 className="font-display text-lg text-navy font-bold mb-3">❌ Exclusions</h4>
                      <ul className="space-y-1.5">
                        {parseLines(selected.exclusions).map((x) => (
                          <li key={x} className="flex gap-2 text-sm">
                            <X className="w-4 h-4 mt-0.5 shrink-0 text-red-400" /> {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <a
                  href={`https://wa.me/${whatsapp}?text=I want to book the ${encodeURIComponent(selected.name)} package (${selected.duration}, ₹${selected.price.toLocaleString("en-IN")}/person)`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-bold btn-3d hover:-translate-y-0.5 transition-transform"
                  style={{ background: "#0A1F44" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Book {selected.name} via WhatsApp →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
