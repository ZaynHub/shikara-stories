import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, MessageCircle } from "lucide-react";
import logo from "@/assets/talib-logo.png.asset.json";
import { loadSettings, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/admin-data";

const navLinks: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Kashmir Tours", to: "/kashmir-tours" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    loadSettings().then(setSettings);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Top utility bar */}
      <div className="hidden md:block bg-navy text-gold">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-gold-soft transition-colors">
              <Phone className="w-3.5 h-3.5" /> {settings.phone}
            </a>
            {settings.phone2 && (
              <a href={`tel:${settings.phone2.replace(/\s/g, "")}`} className="hidden lg:flex items-center gap-1.5 hover:text-gold-soft transition-colors">
                <Phone className="w-3.5 h-3.5" /> {settings.phone2}
              </a>
            )}
            <a href={`mailto:${settings.email}`} className="hidden md:flex items-center gap-1.5 hover:text-gold-soft transition-colors">
              <Mail className="w-3.5 h-3.5" /> {settings.email}
            </a>
          </div>
          <a href={`https://wa.me/${settings.whatsapp}`} className="flex items-center gap-1.5 hover:text-gold-soft transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp us
          </a>
        </div>
      </div>

      {/* Main nav */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.6)",
          boxShadow: scrolled ? "0 10px 30px -20px rgba(10,31,68,0.35)" : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-md border-b"
        style={{ borderColor: scrolled ? "var(--navy)" : "transparent" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="rounded-xl overflow-hidden bg-navy ring-1 ring-navy/20 shadow-sm">
              <img
                src={logo.url}
                alt="Talib's Tour & Travels"
                className="block h-11 md:h-14 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base md:text-lg font-bold text-navy">Talib's</span>
              <span className="text-[10px] md:text-[11px] tracking-[0.18em] font-semibold uppercase" style={{ color: "#C9A84C" }}>Tour &amp; Travels</span>
            </div>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="relative px-3 py-2 text-sm font-medium text-charcoal/80 hover:text-[#C9A84C] transition-colors group"
                  activeProps={{ className: "text-[#C9A84C]" }}
                  activeOptions={{ exact: true }}
                >
                  {l.label}
                  <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-gradient-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-gold text-charcoal font-semibold text-sm btn-3d hover:[--tw:1] hover:-translate-y-0.5 hover:shadow-[0_10px_0_-2px_rgba(26,26,46,0.3),0_18px_30px_-10px_rgba(0,0,0,0.3)] transition-all"
            >
              Plan My Trip
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-navy text-white"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-white border-t border-navy/10"
            >
              <ul className="px-4 py-3 flex flex-col">
                {navLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="block px-2 py-3 text-charcoal font-medium border-b border-border last:border-none hover:text-[#C9A84C]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-3">
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className="block text-center px-5 py-3 rounded-full bg-gold text-charcoal font-semibold btn-3d"
                  >
                    Plan My Trip
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
