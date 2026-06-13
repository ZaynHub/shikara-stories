import { motion } from "framer-motion";
import { Mountain, Heart, Anchor, Car, Camera, Compass, Star, Quote } from "lucide-react";
import { Link } from "@tanstack/react-router";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const packages = [
  { icon: Mountain, title: "Kashmir Tours", desc: "Srinagar, Gulmarg, Pahalgam & Sonmarg curated escapes.", price: "₹14,999", days: "5N / 6D" },
  { icon: Heart, title: "Honeymoon Specials", desc: "Romantic houseboats, candle-lit Shikara dinners & valley sunsets.", price: "₹22,499", days: "6N / 7D" },
  { icon: Compass, title: "Pilgrimage", desc: "Amarnath Yatra, Vaishno Devi & Hazratbal spiritual journeys.", price: "₹18,250", days: "7N / 8D" },
  { icon: Anchor, title: "Houseboat Stays", desc: "Luxury Dal Lake houseboats with hand-carved walnut interiors.", price: "₹6,499", days: "per night" },
  { icon: Car, title: "Car Rental", desc: "Innova, Tempo & private sedans with experienced local drivers.", price: "₹3,200", days: "per day" },
  { icon: Camera, title: "Photography Tours", desc: "Catch the golden chinars & Himalayan sunrises with us.", price: "₹16,800", days: "4N / 5D" },
];



const testimonials = [
  { name: "Priya & Arjun", role: "Honeymoon · Mumbai", text: "Talib designed a fairytale week — Shikara dinners, snow at Gulmarg, every detail flawless." },
  { name: "Rohit Sharma", role: "Family Trip · Bengaluru", text: "Best Kashmir trip we've ever taken. The houseboat was straight out of a dream." },
  { name: "Aisha Khan", role: "Solo · Delhi", text: "Felt safe, looked after and inspired the whole journey. Five stars without hesitation." },
];

export default function Sections() {
  return (
    <main className="bg-background pt-24 md:pt-28">
      {/* Packages */}
      <section id="packages" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-2xl mb-14"
        >
          <span className="text-xs tracking-[0.25em] uppercase text-[#C9A84C] font-semibold">Curated Packages</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 text-charcoal">
            Journeys crafted across <span className="text-gradient-brand">Kashmir</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hand-picked itineraries for every kind of traveler — from snow chasers to soul searchers.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((p, i) => (
            <motion.article
              key={p.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.05 }}
              className="tilt-card group relative rounded-2xl bg-white border border-border p-7 overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-brand opacity-10 group-hover:opacity-30 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-brand grid place-items-center text-white shadow-lg mb-5">
                  <p.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl text-charcoal">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
                <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Starting at</div>
                    <div className="font-display text-2xl text-[#C9A84C] font-bold">{p.price}</div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-cream text-charcoal/70 font-medium">{p.days}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>


      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs tracking-[0.25em] uppercase text-[#C9A84C] font-semibold">Loved by travelers</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 text-charcoal">
            Stories from <span className="text-gradient-brand">the valley</span>.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="tilt-card relative rounded-2xl bg-white border border-border p-7"
            >
              <Quote className="w-8 h-8 text-gold/40 mb-4" />
              <p className="text-charcoal/90 leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-charcoal">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="plan" className="relative py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-brand p-10 md:p-16 text-white shadow-2xl"
          >
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 40%)" }} />
            <div className="relative grid md:grid-cols-[1.5fr_auto] items-center gap-8">
              <div>
                <h2 className="font-display text-4xl md:text-5xl leading-tight">
                  Ready to step into paradise?
                </h2>
                <p className="mt-3 max-w-xl text-white/90">
                  Tell us your dates and dreams. We'll design a Kashmir journey that's truly yours.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#C9A84C] font-bold btn-3d hover:-translate-y-1 transition-transform whitespace-nowrap"
              >
                Plan My Trip →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
