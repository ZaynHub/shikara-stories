import { motion } from "framer-motion";

const HERO_VIDEO_URL = "https://skwxpbuvtrbnffuwvohg.supabase.co/storage/v1/object/public/media/hero-video.mp4";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#06152A] h-[100svh] md:h-screen">
      {/* Background video */}
      <video
        src={HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(6,15,42,0.55)" }}
      />

      {/* ZONE 1 — top content */}
      <div
        className="relative z-10 flex flex-col items-start text-left"
        style={{ padding: "148px 24px 0", maxWidth: "100%" }}
      >
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs md:text-sm"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          ✈️ Trusted Since 2014
        </motion.span>

        <h1 className="mt-5 font-display font-bold leading-[1.05] text-white">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="block"
            style={{ fontSize: "clamp(44px, 7vw, 80px)" }}
          >
            Discover
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="block italic"
            style={{ color: "#C9A84C", fontSize: "clamp(44px, 7vw, 80px)" }}
          >
            Paradise
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="block"
            style={{ fontSize: "clamp(36px, 6vw, 64px)" }}
          >
            on Earth
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-5 text-white/90"
          style={{ fontSize: "14px", maxWidth: "260px" }}
        >
          Kashmir's most trusted travel experts
        </motion.p>
      </div>

      {/* ZONE 2 — bottom pinned */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-6 pt-10 pb-6"
        style={{
          background:
            "linear-gradient(to top, rgba(6,15,42,0.95) 0%, rgba(6,15,42,0.75) 60%, rgba(6,15,42,0) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="flex gap-3">
            <a
              href="#packages"
              className="flex-1 text-center font-bold transition-transform hover:-translate-y-0.5"
              style={{
                background: "#C9A84C",
                color: "#0A1F44",
                borderRadius: "12px",
                padding: "14px 0",
                fontSize: "15px",
                boxShadow: "0 8px 20px rgba(201,168,76,0.4)",
              }}
            >
              Explore Packages
            </a>
            <a
              href="#plan"
              className="flex-1 text-center font-bold text-white transition-colors hover:bg-white/25"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                padding: "14px 0",
                fontSize: "15px",
              }}
            >
              Plan My Trip
            </a>
          </div>

          <p
            className="mt-4 text-center md:text-left text-white/85"
            style={{ fontSize: "11px", letterSpacing: "0.05em" }}
          >
            500+ Travelers <span className="text-[#C9A84C]">|</span> 4.9★{" "}
            <span className="text-[#C9A84C]">|</span> 10+ Years
          </p>
        </div>
      </div>
    </section>
  );
}
