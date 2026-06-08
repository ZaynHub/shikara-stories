import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";

export const Route = createFileRoute("/kashmir-tours")({
  head: () => ({
    meta: [
      { title: "Kashmir Tour Packages — Talib's Tour & Travels" },
      { name: "description", content: "Curated Kashmir tour packages: Honeymoon, Family, Adventure, Pilgrimage, Budget & Luxury trips." },
    ],
  }),
  component: KashmirToursPage,
});

type Category = "Honeymoon" | "Family" | "Adventure" | "Pilgrimage" | "Budget" | "Luxury";

interface Pkg {
  id: number;
  name: string;
  category: Category;
  duration: string;
  price: string;
  hue: string;
  itinerary: { day: string; title: string; details: string }[];
  inclusions: string[];
  exclusions: string[];
}

const packages: Pkg[] = [
  { id: 1, name: "Kashmir Classic", category: "Family", duration: "5D / 4N", price: "₹12,999", hue: "from-kashmir-blue to-emerald-brand",
    itinerary: [
      { day: "Day 1", title: "Arrive Srinagar", details: "Airport pickup, Shikara ride on Dal Lake, houseboat check-in." },
      { day: "Day 2", title: "Gulmarg Excursion", details: "Gondola ride, snow activities, return to Srinagar." },
      { day: "Day 3", title: "Pahalgam Day", details: "Aru, Betaab & Chandanwari valleys." },
      { day: "Day 4", title: "Srinagar Sightseeing", details: "Mughal gardens, local markets, Hazratbal." },
      { day: "Day 5", title: "Departure", details: "Airport drop with sweet memories." },
    ],
    inclusions: ["Accommodation in deluxe hotels & houseboat", "All transfers in private cab", "Daily breakfast & dinner", "All sightseeing as per itinerary", "Permits & taxes"],
    exclusions: ["Airfare", "Personal expenses", "Pony / sledge rides", "Lunch", "Travel insurance"] },
  { id: 2, name: "Romantic Honeymoon", category: "Honeymoon", duration: "6D / 5N", price: "₹18,999", hue: "from-pink-500 to-gold",
    itinerary: [
      { day: "Day 1", title: "Welcome to Paradise", details: "Royal houseboat suite, candle-lit dinner." },
      { day: "Day 2", title: "Gulmarg Romance", details: "Gondola Phase 1 & 2, snow play." },
      { day: "Day 3", title: "Pahalgam Bliss", details: "Riverside lunch, private walks." },
      { day: "Day 4", title: "Sonamarg Snow", details: "Thajiwas glacier visit." },
      { day: "Day 5", title: "Shikara Sunset", details: "Floating market & Mughal gardens." },
      { day: "Day 6", title: "Sweet Goodbye", details: "Airport transfer." },
    ],
    inclusions: ["Luxury houseboat suite", "Candle-lit dinner", "Private cab", "Flower decoration", "Daily breakfast & dinner"],
    exclusions: ["Airfare", "Lunch", "Personal expenses", "Spa & extra activities"] },
  { id: 3, name: "Adventure Trek", category: "Adventure", duration: "7D / 6N", price: "₹15,999", hue: "from-emerald-brand to-emerald-deep",
    itinerary: [
      { day: "Day 1", title: "Srinagar Arrival", details: "Briefing & gear check." },
      { day: "Day 2", title: "Drive to Aru", details: "Acclimatisation walk." },
      { day: "Day 3-5", title: "Tarsar Marsar Trek", details: "Camping under alpine stars." },
      { day: "Day 6", title: "Return to Srinagar", details: "Rest & celebration dinner." },
      { day: "Day 7", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["Certified trek leader", "Camping equipment", "All meals on trek", "Permits", "First-aid"],
    exclusions: ["Personal gear", "Airfare", "Insurance"] },
  { id: 4, name: "Family Special", category: "Family", duration: "5D / 4N", price: "₹10,999", hue: "from-gold to-emerald-brand",
    itinerary: [
      { day: "Day 1", title: "Srinagar Arrival", details: "Houseboat check-in." },
      { day: "Day 2", title: "Gulmarg Fun", details: "Gondola ride for the whole family." },
      { day: "Day 3", title: "Pahalgam Picnic", details: "Family-friendly valleys." },
      { day: "Day 4", title: "Mughal Gardens", details: "Shalimar, Nishat, Chashma Shahi." },
      { day: "Day 5", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["Kid-friendly hotels", "Private cab", "Breakfast & dinner", "All sightseeing"],
    exclusions: ["Airfare", "Lunch", "Pony rides"] },
  { id: 5, name: "Pilgrimage Tour", category: "Pilgrimage", duration: "4D / 3N", price: "₹8,999", hue: "from-kashmir-blue to-navy",
    itinerary: [
      { day: "Day 1", title: "Srinagar Arrival", details: "Hazratbal Shrine darshan." },
      { day: "Day 2", title: "Shankaracharya Temple", details: "Charar-e-Sharief visit." },
      { day: "Day 3", title: "Local Shrines", details: "Guided spiritual tour." },
      { day: "Day 4", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["3-star hotel stay", "Private cab", "Breakfast & dinner", "Spiritual guide"],
    exclusions: ["Airfare", "Donations", "Lunch"] },
  { id: 6, name: "Budget Getaway", category: "Budget", duration: "3D / 2N", price: "₹6,999", hue: "from-emerald-deep to-kashmir-blue",
    itinerary: [
      { day: "Day 1", title: "Srinagar Arrival", details: "Budget hotel check-in, Shikara ride." },
      { day: "Day 2", title: "Local Sightseeing", details: "Mughal gardens & markets." },
      { day: "Day 3", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["Budget hotel", "Breakfast", "Cab transfers", "Shikara ride"],
    exclusions: ["Airfare", "Dinner", "Personal expenses"] },
  { id: 7, name: "Luxury Kashmir", category: "Luxury", duration: "7D / 6N", price: "₹39,999", hue: "from-gold to-navy",
    itinerary: [
      { day: "Day 1", title: "5★ Welcome", details: "Royal suite & welcome dinner." },
      { day: "Day 2", title: "Gulmarg Private", details: "Private gondola booking." },
      { day: "Day 3", title: "Heritage Houseboat", details: "Premier houseboat stay." },
      { day: "Day 4", title: "Pahalgam Retreat", details: "Luxury resort stay." },
      { day: "Day 5", title: "Sonamarg Glacier", details: "Private guide & lunch." },
      { day: "Day 6", title: "Srinagar Leisure", details: "Spa & shopping." },
      { day: "Day 7", title: "Royal Farewell", details: "Airport drop in luxury sedan." },
    ],
    inclusions: ["5-star luxury hotels", "Luxury sedan", "All meals", "Private guide", "Spa session"],
    exclusions: ["Airfare", "Alcohol", "Personal shopping"] },
  { id: 8, name: "Snow Magic", category: "Adventure", duration: "5D / 4N", price: "₹14,499", hue: "from-kashmir-blue to-white",
    itinerary: [
      { day: "Day 1", title: "Srinagar Arrival", details: "Brief & rest." },
      { day: "Day 2-3", title: "Gulmarg Skiing", details: "Ski lessons & gondola." },
      { day: "Day 4", title: "Sonamarg", details: "Glacier trek." },
      { day: "Day 5", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["Ski gear", "Instructor", "Hotel stay", "Breakfast & dinner"],
    exclusions: ["Airfare", "Lunch", "Insurance"] },
  { id: 9, name: "Couples Escape", category: "Honeymoon", duration: "5D / 4N", price: "₹16,999", hue: "from-pink-500 to-kashmir-blue",
    itinerary: [
      { day: "Day 1", title: "Welcome", details: "Houseboat & dinner." },
      { day: "Day 2", title: "Gulmarg", details: "Gondola romance." },
      { day: "Day 3", title: "Pahalgam", details: "Riverside time." },
      { day: "Day 4", title: "Srinagar", details: "Mughal gardens." },
      { day: "Day 5", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["Deluxe houseboat", "Cab", "Breakfast & dinner", "Flower decor"],
    exclusions: ["Airfare", "Lunch", "Personal expenses"] },
  { id: 10, name: "Group Backpacker", category: "Budget", duration: "4D / 3N", price: "₹7,499", hue: "from-emerald-brand to-gold",
    itinerary: [
      { day: "Day 1", title: "Arrival", details: "Hostel check-in." },
      { day: "Day 2", title: "Sightseeing", details: "Srinagar tour." },
      { day: "Day 3", title: "Gulmarg", details: "Day trip." },
      { day: "Day 4", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["Hostel dorms", "Shared transport", "Breakfast"],
    exclusions: ["Airfare", "Lunch & dinner", "Personal expenses"] },
  { id: 11, name: "Char Dham Yatra", category: "Pilgrimage", duration: "6D / 5N", price: "₹12,499", hue: "from-navy to-gold",
    itinerary: [
      { day: "Day 1", title: "Srinagar", details: "Hazratbal darshan." },
      { day: "Day 2", title: "Shankaracharya", details: "Temple visit." },
      { day: "Day 3", title: "Amarnath base", details: "Travel & rest." },
      { day: "Day 4", title: "Yatra", details: "Darshan." },
      { day: "Day 5", title: "Return", details: "Back to Srinagar." },
      { day: "Day 6", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["Hotel stay", "Cab", "Guide", "Meals"],
    exclusions: ["Airfare", "Donations", "Insurance"] },
  { id: 12, name: "Royal Houseboat Week", category: "Luxury", duration: "6D / 5N", price: "₹28,999", hue: "from-gold to-emerald-deep",
    itinerary: [
      { day: "Day 1", title: "Royal Welcome", details: "Heritage houseboat." },
      { day: "Day 2", title: "Floating Market", details: "Sunrise shikara." },
      { day: "Day 3", title: "Gulmarg", details: "Gondola ride." },
      { day: "Day 4", title: "Pahalgam", details: "Resort stay." },
      { day: "Day 5", title: "Srinagar", details: "Gardens & shopping." },
      { day: "Day 6", title: "Departure", details: "Airport drop." },
    ],
    inclusions: ["Heritage houseboat", "Luxury sedan", "All meals", "Spa session"],
    exclusions: ["Airfare", "Alcohol", "Personal shopping"] },
];

const filters = ["All", "Honeymoon", "Family", "Adventure", "Pilgrimage", "Budget", "Luxury"] as const;

function KashmirToursPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selected, setSelected] = useState<Pkg | null>(null);
  const visible = filter === "All" ? packages : packages.filter((p) => p.category === filter);

  return (
    <PageShell>
      <PageHero title="Kashmir Tour Packages" subtitle="Pick a journey crafted for your dreams" />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
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

        <div key={filter} className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 animate-fade-in">
          {visible.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="tilt-card group rounded-2xl bg-white border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-shadow duration-500"
            >
              <div className={`relative h-44 bg-gradient-to-br ${p.hue}`}>
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold text-charcoal text-xs font-bold shadow">{p.category}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-2xl text-charcoal">{p.name}</h3>
                <div className="text-xs text-muted-foreground mt-1">{p.duration}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-3xl text-emerald-brand font-bold">{p.price}</span>
                  <span className="text-xs text-muted-foreground">/person</span>
                </div>
                <div className="mt-auto pt-6 flex gap-3">
                  <button
                    onClick={() => setSelected(p)}
                    className="flex-1 px-4 py-2.5 rounded-full border-2 border-emerald-brand text-emerald-brand text-sm font-semibold hover:bg-emerald-brand hover:text-white transition-colors"
                  >
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
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              <div className={`relative h-40 bg-gradient-to-br ${selected.hue} rounded-t-3xl`}>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow"
                >
                  <X className="w-5 h-5 text-charcoal" />
                </button>
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-gold text-charcoal text-xs font-bold">{selected.category}</span>
                  <h3 className="font-display text-3xl font-bold mt-2">{selected.name}</h3>
                  <p className="text-sm opacity-90">{selected.duration} · {selected.price} /person</p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-7">
                <div>
                  <h4 className="font-display text-xl text-navy font-bold mb-3">Day-wise Itinerary</h4>
                  <ol className="space-y-3">
                    {selected.itinerary.map((d) => (
                      <li key={d.day} className="flex gap-4 p-4 rounded-xl bg-cream border border-border">
                        <div className="font-bold text-emerald-brand min-w-[70px]">{d.day}</div>
                        <div>
                          <div className="font-semibold text-charcoal">{d.title}</div>
                          <div className="text-sm text-muted-foreground">{d.details}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <h4 className="font-display text-lg text-navy font-bold mb-3">Inclusions</h4>
                    <ul className="space-y-2">
                      {selected.inclusions.map((x) => (
                        <li key={x} className="flex gap-2 text-sm"><Check className="w-4 h-4 mt-0.5 text-emerald-brand" /> {x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-navy font-bold mb-3">Exclusions</h4>
                    <ul className="space-y-2">
                      {selected.exclusions.map((x) => (
                        <li key={x} className="flex gap-2 text-sm"><X className="w-4 h-4 mt-0.5 text-red-500" /> {x}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button className="w-full py-4 rounded-full bg-gradient-brand text-white font-bold btn-3d hover:-translate-y-0.5 transition-transform">
                  Book {selected.name} Now →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
