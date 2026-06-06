import { useRef } from "react";
import { motion } from "framer-motion";

const features = [
  { icon: "🏔️", title: "Local Kashmir Experts", desc: "Born and raised in Kashmir, we know every hidden gem." },
  { icon: "💰", title: "Best Price Guarantee", desc: "We match any lower price you find, guaranteed." },
  { icon: "🛡️", title: "100% Safe Travel", desc: "Your safety is our top priority, always." },
  { icon: "📱", title: "24/7 WhatsApp Support", desc: "We're always a message away." },
  { icon: "🏨", title: "Handpicked Hotels", desc: "Only the best stays curated for you." },
  { icon: "🎯", title: "Customized Packages", desc: "Your trip, your way, your budget." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function FeatureCard({ icon, title, desc, accent, delay }: { icon: string; title: string; desc: string; accent: "gold" | "emerald"; delay: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-8px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group rounded-2xl bg-white border border-border p-7 transition-all duration-300 hover:shadow-2xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`w-16 h-16 rounded-full grid place-items-center text-3xl mb-5 ${
            accent === "gold" ? "bg-gold/15" : "bg-emerald-brand/10"
          }`}
        >
          <span>{icon}</span>
        </div>
        <h3 className="font-display text-xl text-charcoal font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-cream py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal">
            Why Travel <span className="text-gradient-brand">With Us?</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 rounded-full bg-gradient-brand" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              desc={f.desc}
              accent={i % 2 === 0 ? "gold" : "emerald"}
              delay={(i % 3) * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
