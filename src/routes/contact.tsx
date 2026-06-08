import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Talib's Tour & Travels" },
      { name: "description", content: "Reach Talib's Tour & Travels — call, email, WhatsApp, or visit us in Srinagar, Kashmir." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll respond within 2 hours. 🎉");
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 900);
  };

  const cards = [
    { icon: MapPin, label: "Visit Us", value: "Srinagar, Kashmir, India", href: "#", color: "bg-emerald-brand" },
    { icon: Phone, label: "Call Us", value: "+91 99999 99999", href: "tel:+919999999999", color: "bg-gold" },
    { icon: Mail, label: "Email Us", value: "hello@talibstours.com", href: "mailto:hello@talibstours.com", color: "bg-kashmir-blue" },
  ];

  return (
    <PageShell>
      <PageHero title="Get In Touch" subtitle="We reply within 2 hours, every day" />

      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-5">
          <h2 className="font-display text-3xl text-navy font-bold">Contact Information</h2>
          <p className="text-muted-foreground">Choose what's easiest — we're a message away.</p>

          {cards.map((c) => (
            <a key={c.label} href={c.href} className="tilt-card flex items-center gap-4 p-5 rounded-2xl bg-white border border-border shadow-sm hover:shadow-xl transition-shadow">
              <div className={`w-14 h-14 rounded-2xl ${c.color} text-white flex items-center justify-center shrink-0`}>
                <c.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{c.label}</div>
                <div className="font-semibold text-charcoal mt-0.5">{c.value}</div>
              </div>
            </a>
          ))}

          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold btn-3d transition-all">
            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
          </a>

          <div className="bg-navy text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-gold" />
              <h3 className="font-display text-xl font-bold">Business Hours</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Mon – Sat</span><span className="text-gold font-semibold">9 AM – 8 PM</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Sunday</span><span className="text-gold font-semibold">10 AM – 6 PM</span></li>
              <li className="flex justify-between"><span>WhatsApp</span><span className="text-gold font-semibold">24 / 7</span></li>
            </ul>
          </div>
        </motion.div>

        <motion.form initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} onSubmit={submit} className="bg-white rounded-3xl shadow-xl border border-border p-7 md:p-9 space-y-5 h-fit">
          <h2 className="font-display text-3xl text-navy font-bold">Send A Message</h2>

          <div>
            <label className="text-sm font-semibold text-charcoal">Your Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:border-emerald-brand transition-colors" placeholder="John Doe" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-charcoal">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:border-emerald-brand" placeholder="you@email.com" />
            </div>
            <div>
              <label className="text-sm font-semibold text-charcoal">Phone</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:border-emerald-brand" placeholder="+91 …" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-charcoal">Message</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:border-emerald-brand resize-none" placeholder="Tell us about your dream Kashmir trip…" />
          </div>
          <button disabled={loading} className="w-full py-4 rounded-full bg-gradient-brand text-white font-bold btn-3d hover:-translate-y-0.5 transition-transform disabled:opacity-60">
            {loading ? "Sending…" : "Send Message →"}
          </button>
        </motion.form>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border-4 border-emerald-brand h-80 bg-gradient-to-br from-cream to-white flex items-center justify-center shadow-lg">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-emerald-brand mx-auto" />
            <div className="mt-3 font-display text-2xl text-navy font-bold">Map Loading…</div>
            <div className="text-sm text-muted-foreground mt-1">Srinagar, Kashmir, India</div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
