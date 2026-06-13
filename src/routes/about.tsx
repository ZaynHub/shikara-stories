import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Heart, Tag, Sparkles } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { loadAbout, DEFAULT_ABOUT, type AboutSettings } from "@/lib/admin-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Talib's Tour & Travels" },
      { name: "description", content: "Born in Kashmir, built for travelers — meet the team behind Talib's Tour & Travels." },
    ],
  }),
  component: AboutPage,
});

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);
  return <span ref={ref}>{n}{suffix}</span>;
}

const stats = [
  { value: 500, suffix: "+", label: "Happy Travelers" },
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Destinations" },
  { value: 4.9, suffix: "★", label: "Avg Rating" },
];

const values = [
  { icon: ShieldCheck, title: "Authenticity", desc: "Real Kashmiri experiences from real locals.", color: "#4A90C4" },
  { icon: Heart, title: "Safety", desc: "Your wellbeing is at the heart of every journey.", color: "#C9A84C" },
  { icon: Tag, title: "Value", desc: "Transparent pricing, no hidden surprises.", color: "#0A1F44" },
  { icon: Sparkles, title: "Memories", desc: "We design moments worth remembering forever.", color: "#7C3AED" },
];

// Distinct gradients per highlight card so they don't all look the same
const HIGHLIGHT_GRADIENTS = [
  "linear-gradient(135deg,#4A90C4,#0A1F44)",
  "linear-gradient(135deg,#C9A84C,#0A1F44)",
  "linear-gradient(135deg,#2D6A4F,#4A90C4)",
  "linear-gradient(135deg,#7C3AED,#0A1F44)",
];

function AboutPage() {
  const [about, setAbout] = useState<AboutSettings>(DEFAULT_ABOUT);

  useEffect(() => { loadAbout().then(setAbout); }, []);

  return (
    <PageShell>
      <PageHero title="About Talib's Tour & Travels" subtitle="Locally rooted. Globally trusted." />

      {/* Our Story */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="text-gold font-semibold tracking-widest text-xs uppercase">Our Story</span>
          <h2 className="font-display text-4xl md:text-5xl text-navy mt-2 font-bold">Born in Kashmir, Built for Travelers</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            For over a decade, Talib's Tour & Travels has been guiding travelers through the breathtaking landscapes of Kashmir. What started as a single founder's love for his homeland has grown into a trusted travel partner for hundreds of families, honeymooners, and adventurers.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We don't just sell tours — we share our home. Every itinerary is hand-crafted by people who grew up in these valleys, ride the same shikaras, and break bread with the same shepherds you'll meet on your trip.
          </p>
        </motion.div>

        {/* "10+ years" card — admin photo replaces gradient when set */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative aspect-square rounded-3xl shadow-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg,#4A90C4,#0A1F44,#060F2A)" }}
        >
          {about.yearsCardPhoto ? (
            <img src={about.yearsCardPhoto} alt="Kashmir experience" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(201,168,76,0.6), transparent 55%)" }} />
          )}
          <div className="absolute bottom-6 left-6 right-6 text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            <div className="font-display text-2xl font-bold">10+ years</div>
            <div className="text-sm opacity-80">of curating Kashmir experiences</div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <div className="font-display text-5xl font-bold" style={{ color: "#C9A84C" }}>
                <Counter end={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-charcoal/70 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder card */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <span className="text-gold font-semibold tracking-widest text-xs uppercase">Meet The Team</span>
        <h2 className="font-display text-4xl text-navy mt-2 font-bold">The Heart Behind The Journey</h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mt-10 mx-auto max-w-sm tilt-card bg-white rounded-3xl border border-border shadow-lg overflow-hidden"
        >
          <div className="h-56 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0A1F44,#4A90C4,#C9A84C)" }}>
            {about.founderPhoto ? (
              <img src={about.founderPhoto} alt={about.founderName} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl">👤</div>
            )}
          </div>
          <div className="p-6">
            <h3 className="font-display text-2xl font-bold text-navy">{about.founderName}</h3>
            <div className="font-semibold text-sm mt-1" style={{ color: "#C9A84C" }}>{about.founderTitle}</div>
            <p className="text-sm text-muted-foreground mt-3">{about.founderBio}</p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold font-semibold tracking-widest text-xs uppercase">Our Values</span>
            <h2 className="font-display text-4xl text-navy mt-2 font-bold">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="tilt-card bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-4" style={{ background: v.color }}>
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-navy">{v.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A Land of Endless Wonder — highlight cards with admin photos */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-gold font-semibold tracking-widest text-xs uppercase">Why Kashmir</span>
          <h2 className="font-display text-4xl text-navy mt-2 font-bold">A Land Of Endless Wonder</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.highlights.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="tilt-card rounded-2xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="h-44 relative overflow-hidden" style={{ background: HIGHLIGHT_GRADIENTS[i % HIGHLIGHT_GRADIENTS.length] }}>
                {h.photo ? (
                  <img src={h.photo} alt={h.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, white, transparent 60%)" }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white font-display text-xl font-bold drop-shadow">{h.name}</div>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
