import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { addEnquiry } from "@/lib/admin-data";

const destinations = ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Full Kashmir", "Custom"];
const tripTypes = ["Honeymoon", "Family", "Adventure", "Pilgrimage", "Budget", "Luxury"];

export default function PlanTripForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    from: "", destination: "", date: "", days: "", type: "",
    name: "", email: "", phone: "", notes: "",
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const message = [
      `From: ${form.from}`,
      `Destination: ${form.destination}`,
      `Date: ${form.date}`,
      `Duration: ${form.days} days`,
      `Trip Type: ${form.type}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");

    const result = await addEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message,
      source: "plan-trip",
    });
    setLoading(false);

    if (result) {
      toast.success("We'll contact you within 2 hours! 🎉");
      setForm({ from: "", destination: "", date: "", days: "", type: "", name: "", email: "", phone: "", notes: "" });
    } else {
      toast.error("Something went wrong. Please try WhatsApp or call us directly.");
    }
  };

  const inputCls = "w-full h-12 px-4 rounded-xl border border-border bg-white/90 text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition";

  return (
    <section id="plan-trip" className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #0A1F44, #4A90C4)" }}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%), radial-gradient(circle at 80% 80%, var(--gold), transparent 40%)" }} />
      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
          className="text-center mb-10 text-white"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">Custom Itinerary</span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">Plan Your Dream Kashmir Trip</h2>
          <p className="mt-3 text-white/80">Tell us your dates and dreams — we'll craft it within 2 hours.</p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 grid md:grid-cols-2 gap-5"
        >
          <input required className={inputCls} placeholder="From (city)" value={form.from} onChange={update("from")} />
          <select required className={inputCls} value={form.destination} onChange={update("destination")}>
            <option value="">Destination</option>
            {destinations.map((d) => <option key={d}>{d}</option>)}
          </select>
          <input required type="date" className={inputCls} value={form.date} onChange={update("date")} />
          <input required type="number" min={1} max={30} className={inputCls} placeholder="Number of days" value={form.days} onChange={update("days")} />
          <select required className={inputCls} value={form.type} onChange={update("type")}>
            <option value="">Trip type</option>
            {tripTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input required className={inputCls} placeholder="Full name" value={form.name} onChange={update("name")} />
          <input required type="email" className={inputCls} placeholder="Email" value={form.email} onChange={update("email")} />
          <input required type="tel" pattern="[6-9][0-9]{9}" maxLength={10} className={inputCls} placeholder="Phone (10-digit)" value={form.phone} onChange={update("phone")} />
          <textarea className={`${inputCls} h-auto min-h-[110px] py-3 md:col-span-2 resize-none`} placeholder="Special requirements (optional)" value={form.notes} onChange={update("notes")} />

          <button
            type="submit" disabled={loading}
            className="md:col-span-2 relative h-14 rounded-xl font-bold text-charcoal text-base flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all duration-150 disabled:opacity-70"
            style={{
              background: "linear-gradient(135deg, var(--gold), var(--gold-soft))",
              boxShadow: "0 6px 0 -1px color-mix(in oklab, var(--charcoal) 25%, transparent), 0 12px 24px -8px rgb(0 0 0 / 0.25)",
            }}
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <>Send My Requirements <Send className="w-4 h-4" /></>}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
