import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Users, Award, MapPin, Headphones } from "lucide-react";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Happy Travelers" },
  { icon: Award, value: 10, suffix: "+", label: "Years Experience" },
  { icon: MapPin, value: 50, suffix: "+", label: "Kashmir Destinations" },
  { icon: Headphones, value: 24, suffix: "/7", label: "Support" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <span className="font-display text-3xl md:text-4xl font-bold text-white">
      {n}
      <span className="text-gold">{suffix}</span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], [0, 120]);
  const yMid = useTransform(scrollY, [0, 600], [0, 60]);
  const fade = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden">
      {/* Layer 1 — backdrop */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 bg-gradient-to-br from-emerald-deep via-kashmir-blue to-emerald-brand"
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 10%, rgba(244,163,0,0.5), transparent 45%), radial-gradient(ellipse at 80% 30%, rgba(255,255,255,0.25), transparent 50%)",
          }}
        />
      </motion.div>

      {/* Layer 2 — mountain silhouettes */}
      <motion.svg
        style={{ y: yMid }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[60%]"
      >
        <defs>
          <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A5C36" stopOpacity="0.7" />
            <stop offset="1" stopColor="#0A1F44" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1B4F8A" stopOpacity="0.6" />
            <stop offset="1" stopColor="#0A1F44" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path d="M0,420 L160,260 L320,360 L480,200 L640,340 L800,240 L960,360 L1120,220 L1280,340 L1440,260 L1440,600 L0,600 Z" fill="url(#m1)" />
        <path d="M0,500 L120,400 L260,460 L420,360 L600,460 L780,380 L960,470 L1140,380 L1300,460 L1440,400 L1440,600 L0,600 Z" fill="url(#m2)" />
      </motion.svg>

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Layer 3 — content */}
      <motion.div style={{ opacity: fade }} className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 pt-32 pb-40 w-full">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-cream text-xs tracking-[0.2em] uppercase mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Welcome to Kashmir
            </motion.span>

            <h1 className="font-display font-bold text-white leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              <motion.span
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="block"
              >
                Discover Paradise
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block italic text-gold"
              >
                on Earth
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-6 max-w-xl text-base md:text-lg text-cream/90"
            >
              Experience the Magic of Kashmir with Talib's Tour &amp; Travels — curated houseboats, Himalayan
              escapes and honeymoons crafted with love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <a
                href="#packages"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gold text-charcoal font-semibold btn-3d hover:-translate-y-1 transition-transform"
              >
                Explore Packages
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#plan"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-white/80 text-white font-semibold hover:bg-white hover:text-charcoal transition-colors"
              >
                Plan My Trip
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-44 md:bottom-48 flex flex-col items-center text-white/80">
          <span className="text-[10px] tracking-[0.3em] uppercase mb-2">Scroll</span>
          <ArrowDown className="w-5 h-5 animate-bounce-down" />
        </div>

        {/* Floating stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="relative z-10 mx-4 md:mx-auto md:max-w-6xl -mb-16 md:-mb-20"
        >
          <div className="glass-dark rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, suffix, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-brand grid place-items-center text-white shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <Counter to={value} suffix={suffix} />
                  <span className="text-xs md:text-sm text-cream/80">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
