import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

type Review = { text: string; name: string; city: string; stars: number };

const reviews: Review[] = [
  { text: "Absolutely magical! Talib's team arranged everything perfectly. Dal Lake at sunrise was breathtaking. Best trip of my life.", name: "Priya S.", city: "Mumbai", stars: 5 },
  { text: "Our honeymoon was a dream. Every single detail was handled. The houseboat stay on Dal Lake was unforgettable.", name: "Neha & Arjun", city: "Pune", stars: 5 },
  { text: "Gulmarg in snow is another world. Talib's team made it so easy and safe. Highly recommend to everyone!", name: "Vikram P.", city: "Chennai", stars: 5 },
  { text: "Professional, warm, and always available on WhatsApp. Felt like traveling with family not a tour company.", name: "Rahul M.", city: "Delhi", stars: 5 },
  { text: "Best Kashmir package at the best price. Hotels were excellent, driver was amazing. Will definitely book again!", name: "Anjali K.", city: "Bangalore", stars: 5 },
  { text: "Pahalgam was breathtaking. The customized itinerary was perfect for our family with kids. Zero stress trip!", name: "Suresh & Family", city: "Hyderabad", stars: 5 },
  { text: "Amarnath pilgrimage was spiritually fulfilling and perfectly organized. Talib's team took care of everything.", name: "Ramesh G.", city: "Gujarat", stars: 5 },
  { text: "From airport pickup to drop, everything was seamless. Kashmir is heaven and Talib's made it even more special.", name: "Meera T.", city: "Kolkata", stars: 5 },
];

const initials = (n: string) => n.split(/[\s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const avatarColors = ["bg-[#4A90C4]", "bg-gold", "bg-kashmir-blue", "bg-navy"];

function Card({ r, i }: { r: Review; i: number }) {
  return (
    <div
      className="shrink-0 w-[320px] min-h-[200px] bg-white rounded-2xl p-6 mr-6 relative transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
      style={{ borderLeft: "4px solid var(--gold)", boxShadow: "0 8px 24px -12px rgb(0 0 0 / 0.15)" }}
    >
      <Quote className="absolute top-3 left-4 w-8 h-8 text-gold/40" />
      <p className="italic text-charcoal/85 text-sm leading-relaxed mt-4">"{r.text}"</p>
      <div className="mt-5 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full grid place-items-center text-white text-sm font-bold ${avatarColors[i % avatarColors.length]}`}>
          {initials(r.name)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-[#C9A84C]">{r.name}</div>
          <div className="text-xs text-muted-foreground">{r.city}</div>
        </div>
      </div>
      <div className="mt-3 flex gap-0.5">
        {Array.from({ length: r.stars }).map((_, j) => (
          <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
        ))}
      </div>
    </div>
  );
}

function Row({ direction }: { direction: "left" | "right" }) {
  const items = [...reviews, ...reviews];
  return (
    <div className="marquee-row marquee-mask overflow-hidden py-3">
      <div className={`marquee-track ${direction === "left" ? "marquee-left" : "marquee-right"}`}>
        {items.map((r, i) => <Card key={`${direction}-${i}`} r={r} i={i} />)}
      </div>
    </div>
  );
}

export default function TestimonialsMarquee() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background: "var(--cream)",
        backgroundImage: "radial-gradient(circle, color-mix(in oklab, var(--charcoal) 8%, transparent) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
        className="text-center max-w-2xl mx-auto px-6 mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl text-charcoal">
          What Our <span className="text-gradient-brand">Travelers</span> Say
        </h2>
        <p className="mt-3 text-muted-foreground">Join 500+ happy Kashmir travelers</p>
        <div className="mt-5 inline-flex items-center gap-3 bg-white rounded-full px-5 py-2.5 shadow-md border border-border">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
          </div>
          <span className="text-sm font-bold text-charcoal">4.9/5 on Google Reviews</span>
          <span className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
          </span>
        </div>
      </motion.div>

      <Row direction="left" />
      <Row direction="right" />

      <div className="text-center mt-10">
        <a
          href="https://www.google.com/maps" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-[#C9A84C] text-[#C9A84C] font-semibold hover:bg-[#4A90C4] hover:text-white transition-all duration-300"
        >
          Read All Google Reviews →
        </a>
      </div>
    </section>
  );
}
