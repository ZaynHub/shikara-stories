import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { loadSettings, DEFAULT_SETTINGS } from "@/lib/admin-data";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [whatsapp, setWhatsapp] = useState(DEFAULT_SETTINGS.whatsapp);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    loadSettings().then((s) => setWhatsapp(s.whatsapp));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="group fixed bottom-6 right-6 z-50"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full animate-ping-ring" style={{ background: "#C9A84C" }} />
        <span className="relative grid place-items-center w-14 h-14 rounded-full text-white shadow-xl hover:scale-110 transition-transform" style={{ background: "#C9A84C" }}>
          <MessageCircle className="w-6 h-6" style={{ color: "#0A1F44" }} />
        </span>
        <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-md bg-charcoal text-white text-xs opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          Chat with us on WhatsApp
        </span>
      </a>

      {/* Scroll-to-top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-6 z-50 grid place-items-center w-12 h-12 rounded-full bg-gold text-charcoal shadow-lg hover:-translate-y-0.5 transition-transform"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
