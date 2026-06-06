import { Facebook, Instagram, Youtube, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/talib-logo.png.asset.json";

const quickLinks = ["Home", "About", "Tours", "Gallery", "Contact", "Blog"];
const policies = ["Terms & Conditions", "Privacy Policy", "Refund Policy", "Payment Policy"];

export default function Footer() {
  return (
    <footer className="relative bg-emerald-brand text-cream">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #F4A300 0, transparent 40%), radial-gradient(circle at 80% 70%, #1B4F8A 0, transparent 45%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-xl overflow-hidden bg-navy ring-1 ring-white/10">
              <img src={logo.url} alt="Talib's Tour & Travels" className="h-14 w-auto" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl font-bold text-white">Talib's</div>
              <div className="text-[11px] tracking-[0.2em] text-gold uppercase">Tour &amp; Travels</div>
            </div>
          </div>
          <p className="text-sm text-cream/80 leading-relaxed">
            Your gateway to paradise. Crafting unforgettable Kashmir journeys with warmth, comfort and
            authentic hospitality since 2014.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[Facebook, Instagram, MessageCircle, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-charcoal text-white transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-5">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l}>
                <a href="#" className="text-cream/80 hover:text-gold transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-5">Policies</h4>
          <ul className="space-y-2.5 text-sm">
            {policies.map((l) => (
              <li key={l}>
                <a href="#" className="text-cream/80 hover:text-gold transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-5">Contact Us</h4>
          <ul className="space-y-3 text-sm text-cream/85">
            <li className="flex gap-3">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              Dal Lake Boulevard, Srinagar, Jammu &amp; Kashmir 190001
            </li>
            <li className="flex gap-3">
              <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <a href="tel:+919999999999" className="hover:text-gold">+91 99999 99999</a>
            </li>
            <li className="flex gap-3">
              <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <a href="mailto:hello@talibstours.com" className="hover:text-gold">hello@talibstours.com</a>
            </li>
          </ul>
          <a
            href="https://wa.me/919999999999"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-semibold text-sm btn-3d hover:-translate-y-0.5 transition-transform"
          >
            <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="relative bg-emerald-deep/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center text-xs text-cream/70">
          © {new Date().getFullYear()} Talib's Tour &amp; Travels. All rights reserved. Crafted with love in Kashmir.
        </div>
      </div>
    </footer>
  );
}
