import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Save, ImagePlus, Trash2, Plus, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  type SiteSettings, type AboutSettings,
  loadSettings, saveSettings, DEFAULT_SETTINGS,
  loadAbout, saveAbout, DEFAULT_ABOUT,
  addAboutHighlight, deleteAboutHighlight,
} from "@/lib/admin-data";
import { uploadImage } from "@/lib/storage";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

function Field({ label, hint, value, onChange, type = "text" }: {
  label: string; hint?: string; value: string;
  onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
      />
    </div>
  );
}

function PhotoUpload({
  label, value, onChange, height = 160, folder = "about",
}: { label: string; value: string; onChange: (v: string) => void; height?: number; folder?: "about" | "gallery" }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, folder);
    setUploading(false);
    e.target.value = "";
    if (url) onChange(url);
    else toast.error("Upload failed");
  };

  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="mt-1.5">
        {value ? (
          <div className="relative rounded-xl overflow-hidden" style={{ height }}>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
            style={{ height }}
          >
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
            <span className="text-xs">{uploading ? "Uploading…" : "Upload Photo"}</span>
          </button>
        )}
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} />
      </div>
    </div>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [about, setAbout] = useState<AboutSettings>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"contact" | "about">("contact");

  useEffect(() => {
    Promise.all([loadSettings(), loadAbout()]).then(([s, a]) => {
      setSettings(s);
      setAbout(a);
      setLoading(false);
    });
  }, []);

  const set = (key: keyof SiteSettings) => (v: string) => setSettings((s) => ({ ...s, [key]: v }));

  const updateHighlight = (id: string, field: "name" | "desc" | "photo", val: string) => {
    setAbout((a) => ({
      ...a,
      highlights: a.highlights.map((h) => h.id === id ? { ...h, [field]: val } : h),
    }));
  };

  const addHighlight = async () => {
    const id = await addAboutHighlight({ name: "", desc: "", photo: "" });
    if (id) {
      setAbout((a) => ({
        ...a,
        highlights: [...a.highlights, { id, name: "", desc: "", photo: "" }],
      }));
    } else {
      // fallback — add temp ID locally, will sync on save
      setAbout((a) => ({
        ...a,
        highlights: [...a.highlights, { id: crypto.randomUUID(), name: "", desc: "", photo: "" }],
      }));
    }
  };

  const removeHighlight = async (id: string) => {
    await deleteAboutHighlight(id);
    setAbout((a) => ({ ...a, highlights: a.highlights.filter((h) => h.id !== id) }));
  };

  const onSave = async () => {
    setSaving(true);
    const [ok1, ok2] = await Promise.all([saveSettings(settings), saveAbout(about)]);
    setSaving(false);
    if (ok1 && ok2) toast.success("Settings saved! ✅");
    else toast.error("Some settings failed to save. Please try again.");
  };

  const TABS = [
    { id: "contact", label: "📞 Contact & Social" },
    { id: "about", label: "👤 About Page" },
  ] as const;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading settings…
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="font-bold" style={{ fontFamily: '"Playfair Display", serif', color: "#0A1F44", fontSize: 28 }}>
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage contact details, social links, and About page content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={tab === t.id ? { background: "#0A1F44", color: "#fff" } : { background: "#F0F4FF", color: "#0A1F44" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Contact & Social Tab ── */}
        {tab === "contact" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 mb-4">
              <h2 className="font-bold text-base" style={{ color: "#0A1F44" }}>📞 Contact Details</h2>
              <Field
                label="WhatsApp Number"
                hint="Include country code, no + or spaces. E.g. 919906757390"
                value={settings.whatsapp}
                onChange={set("whatsapp")}
              />
              <Field label="Primary Phone (displayed on site)" value={settings.phone} onChange={set("phone")} />
              <Field label="Alternate Phone 2 (optional)" value={settings.phone2 ?? ""} onChange={set("phone2")} />
              <Field label="Alternate Phone 3 (optional)" value={settings.phone3 ?? ""} onChange={set("phone3")} />
              <Field label="Email Address" type="email" value={settings.email} onChange={set("email")} />
              <Field label="Business Address" value={settings.address} onChange={set("address")} />
              <Field label="Google Maps Location URL" value={settings.locationUrl} onChange={set("locationUrl")} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 mb-6">
              <h2 className="font-bold text-base" style={{ color: "#0A1F44" }}>📲 Social Media Links</h2>
              <Field label="Instagram URL" value={settings.instagram} onChange={set("instagram")} />
              <Field label="Facebook URL" value={settings.facebook} onChange={set("facebook")} />
              <Field label="YouTube URL" value={settings.youtube} onChange={set("youtube")} />
            </div>
          </>
        )}

        {/* ── About Page Tab ── */}
        {tab === "about" && (
          <>
            {/* Founder Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 mb-4">
              <h2 className="font-bold text-base" style={{ color: "#0A1F44" }}>👤 Founder Card</h2>
              <PhotoUpload label="Founder Photo" value={about.founderPhoto} onChange={(v) => setAbout((a) => ({ ...a, founderPhoto: v }))} height={180} />
              <Field label="Founder Name" value={about.founderName} onChange={(v) => setAbout((a) => ({ ...a, founderName: v }))} />
              <Field label="Title / Role" value={about.founderTitle} onChange={(v) => setAbout((a) => ({ ...a, founderTitle: v }))} />
              <div>
                <label className="text-sm font-semibold text-gray-700">Bio</label>
                <textarea
                  rows={3}
                  value={about.founderBio}
                  onChange={(e) => setAbout((a) => ({ ...a, founderBio: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
                />
              </div>
            </div>

            {/* 10+ Years Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 mb-4">
              <h2 className="font-bold text-base" style={{ color: "#0A1F44" }}>🏔️ "10+ Years" Experience Card</h2>
              <p className="text-xs text-gray-400">This is the large card shown beside the "Our Story" text on the About page.</p>
              <PhotoUpload label="Experience Card Photo" value={about.yearsCardPhoto} onChange={(v) => setAbout((a) => ({ ...a, yearsCardPhoto: v }))} height={200} />
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base" style={{ color: "#0A1F44" }}>🗺️ "Endless Wonder" Highlight Cards</h2>
                <button
                  onClick={addHighlight}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: "#C9A84C", color: "#0A1F44" }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Card
                </button>
              </div>

              {about.highlights.map((h, i) => (
                <div key={h.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Card {i + 1}</span>
                    <button onClick={() => removeHighlight(h.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <PhotoUpload label="Card Photo" value={h.photo} onChange={(v) => updateHighlight(h.id, "photo", v)} height={120} />
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Destination Name</label>
                    <input
                      value={h.name}
                      onChange={(e) => updateHighlight(h.id, "name", e.target.value)}
                      className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]"
                      placeholder="e.g. Gulmarg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Short Description</label>
                    <input
                      value={h.desc}
                      onChange={(e) => updateHighlight(h.id, "desc", e.target.value)}
                      className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]"
                      placeholder="e.g. Meadow of flowers with the world's highest gondola"
                    />
                  </div>
                </div>
              ))}

              {about.highlights.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No highlight cards yet. Click "Add Card" to create one.</p>
              )}
            </div>
          </>
        )}

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm shadow-md transition-opacity disabled:opacity-60"
          style={{ background: "#C9A84C", color: "#0A1F44" }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save All Settings"}
        </button>
      </div>
    </AdminLayout>
  );
}
