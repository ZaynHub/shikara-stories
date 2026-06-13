import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Loader2, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { type Enquiry, loadEnquiries, updateEnquiryStatus, deleteEnquiry } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({ meta: [{ title: "Enquiries — Admin" }, { name: "robots", content: "noindex" }] }),
  component: EnquiriesInbox,
});

const STATUS_STYLES: Record<Enquiry["status"], { bg: string; fg: string; label: string }> = {
  new:     { bg: "#FEF3C7", fg: "#78350F", label: "New" },
  read:    { bg: "#E0E7FF", fg: "#312E81", label: "Read" },
  replied: { bg: "#D1FAE5", fg: "#065F46", label: "Replied" },
};
const STATUS_ORDER: Enquiry["status"][] = ["new", "read", "replied"];

function EnquiriesInbox() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Enquiry["status"]>("all");

  useEffect(() => {
    loadEnquiries().then((data) => { setEnquiries(data); setLoading(false); });
  }, []);

  const cycleStatus = async (id: string) => {
    const e = enquiries.find((x) => x.id === id);
    if (!e) return;
    const nextStatus = STATUS_ORDER[(STATUS_ORDER.indexOf(e.status) + 1) % STATUS_ORDER.length];
    const ok = await updateEnquiryStatus(id, nextStatus);
    if (ok) setEnquiries((prev) => prev.map((x) => x.id === id ? { ...x, status: nextStatus } : x));
  };

  const removeEnquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    const ok = await deleteEnquiry(id);
    if (ok) setEnquiries((prev) => prev.filter((x) => x.id !== id));
  };

  const expand = async (id: string) => {
    if (expanded !== id) {
      const e = enquiries.find((x) => x.id === id);
      if (e && e.status === "new") {
        await updateEnquiryStatus(id, "read");
        setEnquiries((prev) => prev.map((x) => x.id === id ? { ...x, status: "read" } : x));
      }
    }
    setExpanded(expanded === id ? null : id);
  };

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);
  const counts = {
    all:     enquiries.length,
    new:     enquiries.filter((e) => e.status === "new").length,
    read:    enquiries.filter((e) => e.status === "read").length,
    replied: enquiries.filter((e) => e.status === "replied").length,
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}>
            Enquiries Inbox
          </h1>
          {counts.new > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#C9A84C", color: "#0A1F44" }}>
              {counts.new} new
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">Messages sent by visitors from your website</p>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(["all", "new", "read", "replied"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
            style={{ background: filter === s ? "#0A1F44" : "#F0F4FF", color: filter === s ? "#FFF" : "#0A1F44" }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading enquiries…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📩</div>
          <p className="font-semibold text-gray-600 text-lg">
            {filter === "all" ? "No enquiries yet" : `No ${filter} enquiries`}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {filter === "all"
              ? "When visitors fill in the contact form, their messages will appear here"
              : "Try switching to a different filter above"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((enq) => {
              const st = STATUS_STYLES[enq.status];
              const isOpen = expanded === enq.id;
              const date = new Date(enq.createdAt);
              const dateStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
              const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
              return (
                <motion.div key={enq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  style={{ borderLeft: enq.status === "new" ? "4px solid #C9A84C" : undefined }}>
                  <button className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors" onClick={() => expand(enq.id)}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white" style={{ background: "#0A1F44" }}>
                      {enq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm" style={{ color: "#0A1F44" }}>{enq.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: st.bg, color: st.fg }}>{st.label}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{dateStr} at {timeStr}</div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{enq.message}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                          <div className="grid sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400" /><span>{enq.email}</span></div>
                            {enq.phone && <div className="flex items-center gap-2 text-gray-600"><Phone className="w-3.5 h-3.5 text-gray-400" /><span>{enq.phone}</span></div>}
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3"><p className="text-sm text-gray-700 whitespace-pre-wrap">{enq.message}</p></div>
                          <div className="flex flex-wrap gap-2">
                            <a href={`tel:${enq.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "#0A1F44" }}>
                              <Phone className="w-3 h-3" /> Call
                            </a>
                            <a href={`https://wa.me/${enq.phone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "#C9A84C", color: "#0A1F44" }}>
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </a>
                            <a href={`mailto:${enq.email}?subject=Re: Your Kashmir Trip Enquiry`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600">
                              <Mail className="w-3 h-3" /> Email
                            </a>
                            <button onClick={() => cycleStatus(enq.id)}
                              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                              Mark as {STATUS_ORDER[(STATUS_ORDER.indexOf(enq.status) + 1) % STATUS_ORDER.length]}
                            </button>
                            <button onClick={() => removeEnquiry(enq.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </AdminLayout>
  );
}
