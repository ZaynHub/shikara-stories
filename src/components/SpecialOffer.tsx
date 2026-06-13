import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, MessageCircle } from "lucide-react";
import { loadOffers, loadSettings, DEFAULT_SETTINGS, type AdminOffer } from "@/lib/admin-data";

const DEFAULT_TARGET = new Date("2026-06-30T23:59:59").getTime();

function useCountdown(targetMs: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const tick = () => setT(Math.max(0, targetMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  const days    = Math.floor(t / 86400000);
  const hours   = Math.floor((t % 86400000) / 3600000);
  const minutes = Math.floor((t % 3600000) / 60000);
  const seconds = Math.floor((t % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-4 py-3 min-w-[68px]">
        <div className="font-display text-3xl md:text-4xl text-white font-bold tabular-nums">{String(value).padStart(2, "0")}</div>
      </div>
      <div className="text-[10px] tracking-[0.25em] uppercase text-white/85 mt-2">{label}</div>
    </div>
  );
}

export default function SpecialOffer() {
  const [offer, setOffer] = useState<AdminOffer | null>(null);
  const [whatsapp, setWhatsapp] = useState(DEFAULT_SETTINGS.whatsapp);

  useEffect(() => {
    Promise.all([loadOffers(), loadSettings()]).then(([offers, settings]) => {
      const active = offers.filter((o) => o.active);
      if (active.length > 0) setOffer(active[0]);
      setWhatsapp(settings.whatsapp);
    });
  }, []);

  const targetMs = offer?.validUntil ? new Date(offer.validUntil).getTime() : DEFAULT_TARGET;
  const { days, hours, minutes, seconds } = useCountdown(targetMs);

  const title       = offer?.title       || "Summer Kashmir Special — Up to 30% Off!";
  const description = offer?.description || "Book before 30th June 2026 and get exclusive discounts on tours, houseboats and honeymoon packages.";
  const discount    = offer?.discount    || "30%";

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(120deg, #C9A84C 0%, #0A1F44 100%)" }}>
      {/* floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => {
          const left = (i * 37) % 100;
          const top  = (i * 53) % 100;
          const tx   = ((i % 5) - 2) * 30 + "px";
          const ty   = -40 - (i % 4) * 20 + "px";
          const delay = (i * 0.3) % 6;
          return (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/60 animate-particle"
              style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s`, ["--tx" as any]: tx, ["--ty" as any]: ty }}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
        className="relative max-w-5xl mx-auto px-6 text-center text-white"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold animate-pulse">
          <Flame className="w-4 h-4" /> Limited Time Offer — {discount} OFF
        </span>
        <h2 className="font-display text-4xl md:text-6xl mt-5 leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-white/90 max-w-2xl mx-auto">{description}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Box value={days}    label="Days" />
          <Box value={hours}   label="Hours" />
          <Box value={minutes} label="Minutes" />
          <Box value={seconds} label="Seconds" />
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <a href="#plan-trip" className="px-7 py-3.5 rounded-full bg-white text-charcoal font-bold btn-3d hover:-translate-y-1 transition-transform">
            Grab This Deal
          </a>
          <a
            href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
            className="px-7 py-3.5 rounded-full font-bold btn-3d hover:-translate-y-1 transition-transform inline-flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)" }}
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp Us Now
          </a>
        </div>
      </motion.div>
    </section>
  );
}
