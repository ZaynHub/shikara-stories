import { motion } from "framer-motion";
import { Anchor, Car, ArrowRight, Check } from "lucide-react";

const cards = [
  {
    title: "Stay on Dal Lake",
    subtitle: "Luxury houseboats, unforgettable nights",
    icon: Anchor,
    features: ["Hand-carved walnut interiors", "Private deck with lake views", "Daily Shikara rides included"],
    cta: "Book Houseboat",
    bg: "linear-gradient(135deg, var(--navy), var(--kashmir-blue))",
    from: -60,
  },
  {
    title: "Explore at Your Pace",
    subtitle: "Comfortable cars with local drivers",
    icon: Car,
    features: ["Innova, Tempo & sedans", "Experienced Kashmiri drivers", "Flexible day-wise itinerary"],
    cta: "Book Car",
    bg: "linear-gradient(135deg, #0A1F44, #4A90C4)",
    from: 60,
  },
];

export default function HouseboatCarRental() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-7">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, x: c.from }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: i * 0.05 }}
            className="tilt-card group relative rounded-3xl overflow-hidden p-10 text-white shadow-xl"
            style={{ background: c.bg, minHeight: 360 }}
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 40%)" }} />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur grid place-items-center mb-5">
                <c.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-3xl md:text-4xl">{c.title}</h3>
              <p className="mt-2 text-white/80">{c.subtitle}</p>
              <ul className="mt-6 space-y-2.5">
                {c.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/95">
                    <Check className="w-4 h-4 text-gold shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#plan-trip"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-charcoal font-bold btn-3d hover:-translate-y-1 transition-transform"
              >
                {c.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
