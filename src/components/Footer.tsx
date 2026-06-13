import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import logo from "@/assets/talib-logo.png.asset.json";
import { loadSettings, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/admin-data";

const Facebook = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.6V4.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.6H7.6V14h2.7v8h3.2z"/></svg>
);
const Instagram = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
);
const Youtube = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23 7.3s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.2-1C16.7 3.7 12 3.7 12 3.7s-4.7 0-7.9.3c-.4.1-1.3.1-2.2 1C1.2 5.7 1 7.3 1 7.3S.8 9.2.8 11.1v1.7c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.7.3 7.7.3s4.7 0 7.9-.3c.4-.1 1.3-.1 2.2-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.7c0-1.9-.2-3.8-.2-3.8zM9.8 14.9V8.4l6 3.3-6 3.2z"/></svg>
);

const quickLinks = ["Home", "About", "Tours", "Gallery", "Contact", "Blog"];
const policies = ["Terms & Conditions", "Privacy Policy", "Refund Policy", "Payment Policy"];

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  useEffect(() => { loadSettings().then(setSettings); }, []);

  return (
    <footer className="relative text-cream" style={{ background: "#0A1F44" }}>
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
            {[Facebook, Instagram, MessageCircle, Youtube].map((Icon, i) => {
              let href = "#";
              if (i === 0) href = settings.facebook;
              if (i === 1) href = settings.instagram;
              if (i === 2) href = `https://wa.me/${settings.whatsapp}`;
              if (i === 3) href = settings.youtube;
              
              return (
                <a
                  key={i}
                  href={href}
                  target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-charcoal text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
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
          <ul className="space-y-4">
            <li className="flex gap-3 items-start group">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <a href={settings.locationUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cream/80 leading-relaxed hover:text-white transition-colors">
                {settings.address}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-gold">{settings.phone}</a>
                {settings.phone2 && <a href={`tel:${settings.phone2.replace(/\s/g, "")}`} className="hover:text-gold opacity-80">{settings.phone2}</a>}
                {settings.phone3 && <a href={`tel:${settings.phone3.replace(/\s/g, "")}`} className="hover:text-gold opacity-80">{settings.phone3}</a>}
              </div>
            </li>
            <li className="flex gap-3">
              <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <a href={`mailto:${settings.email}`} className="hover:text-gold break-all">{settings.email}</a>
            </li>
          </ul>

          <a
            href={`https://wa.me/${settings.whatsapp}`}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm btn-3d hover:-translate-y-0.5 transition-transform"
            style={{ background: "#C9A84C", color: "#0A1F44" }}
          >
            <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 text-center text-xs text-cream/70">
          © {new Date().getFullYear()} Talib's Tour &amp; Travels. All rights reserved. Crafted with love in Kashmir.
        </div>
      </div>
    </footer>
  );
}
