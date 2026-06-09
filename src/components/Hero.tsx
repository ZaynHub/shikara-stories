import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Luggage, CalendarDays, MapPin, Star } from "lucide-react";
import heroImg from "@/assets/kashmir-hero.jpg.asset.json";

const stats = [
  { icon: Luggage, value: 500, suffix: "+", label: "Happy Travelers", decimals: 0 },
  { icon: CalendarDays, value: 10, suffix: "+", label: "Years Experience", decimals: 0 },
  { icon: MapPin, value: 50, suffix: "+", label: "Destinations", decimals: 0 },
  { icon: Star, value: 4.9, suffix: "", label: "Google Rating", decimals: 1 },
];

function Counter({ to, suffix, decimals = 0 }: { to: number; suffix: string; decimals?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <span className="font-display text-3xl md:text-4xl font-bold text-gold">
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* seeded pseudo-random so SSR and client emit identical particles */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeParticles(seed: number) {
  const rand = mulberry32(seed);
  return Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: rand() * 100,
    top: rand() * 100,
    size: 2 + rand() * 2,
    duration: 3 + rand() * 5,
    delay: rand() * 5,
    opacity: 0.4 + rand() * 0.4,
    gold: rand() > 0.5,
  }));
}

const PARTICLES = makeParticles(42);

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0A1F44]">
      {/* LAYER 1+2 — Image with Ken Burns + scroll parallax */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        <img
          src={heroImg.url}
          alt="Snow-capped Kashmir mountains glowing at sunrise reflected in a still alpine lake"
          className="absolute left-[-5%] top-[-5%] h-[110%] w-[110%] object-cover object-center animate-ken-burns"
        />
      </div>

      {/* LAYER 3 — Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to top, #0A1F44 0%, rgba(10,31,68,0.7) 40%, rgba(10,31,68,0.2) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,31,68,0.6) 0%, transparent 60%)",
        }}
      />

      {/* LAYER 4 — Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p: { id: number; left: number; top: number; size: number; duration: number; delay: number; opacity: number; gold: boolean }) => (
          <span
            key={p.id}
            className="absolute rounded-full animate-hero-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.gold ? "#C9A84C" : "#ffffff",
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              boxShadow: p.gold
                ? "0 0 6px rgba(201,168,76,0.7)"
                : "0 0 6px rgba(255,255,255,0.7)",
            }}
          />
        ))}
      </div>

      {/* LAYER 5 — Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center pb-[120px] px-6">
          <div className="max-w-4xl text-center">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs md:text-sm tracking-wide"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              ✈️ Kashmir's Most Trusted Travel Partner
            </motion.span>

            <h1 className="mt-6 font-display font-bold leading-[1] text-white">
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="block text-[42px] md:text-[80px]"
              >
                Discover Paradise
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="block italic text-[42px] md:text-[80px]"
                style={{ color: "#C9A84C" }}
              >
                on Earth
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-6 mx-auto max-w-[520px] text-base md:text-lg text-white/85"
            >
              Experience the magic of Kashmir with Talib's trusted local guides
            </motion.p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <motion.a
                href="#packages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold transition-all duration-300 hover:-translate-y-[3px]"
                style={{
                  background: "#C9A84C",
                  color: "#0A1F44",
                  boxShadow: "0 8px 24px rgba(201,168,76,0.5)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 14px 34px rgba(201,168,76,0.65)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,168,76,0.5)")
                }
              >
                Explore Packages
              </motion.a>
              <motion.a
                href="#plan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-white border-2 border-white transition-colors duration-300 hover:bg-white hover:text-[#0A1F44]"
              >
                Plan My Trip
              </motion.a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-[140px] md:bottom-[150px] flex flex-col items-center text-white/80"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase mb-2">Scroll to Explore</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl"
          >
            ↓
          </motion.span>
        </motion.div>

        {/* Floating stats bar */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-white/20">
            {stats.map(({ icon: Icon, value, suffix, label, decimals }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-3 md:px-4 text-center md:text-left"
              >
                <Icon className="w-6 h-6 text-gold shrink-0" />
                <div className="flex flex-col items-start">
                  <Counter to={value} suffix={suffix} decimals={decimals} />
                  <span className="text-xs md:text-sm text-white/80 font-light">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
