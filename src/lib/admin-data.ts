// ─────────────────────────────────────────────────────────
//  Talib's Tour & Travels — Admin Data Layer (Supabase)
// ─────────────────────────────────────────────────────────
import { supabase } from "@/lib/supabase";

// ──────── Types ────────
export type PackageType =
  | "Honeymoon" | "Family" | "Adventure"
  | "Pilgrimage" | "Budget" | "Luxury";

export interface AdminPackage {
  id: string;
  name: string;
  type: PackageType;
  price: number;
  duration: string;
  shortDescription: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  image: string;        // public Storage URL
  active: boolean;
  bestSeller: boolean;
  createdAt: number;
}

export interface AdminOffer {
  id: string;
  title: string;
  discount: string;
  validUntil: string;
  description: string;
  bannerImage: string;  // public Storage URL
  active: boolean;
  createdAt: number;
}

export interface GalleryPhoto {
  id: string;
  url: string;          // public Storage URL
  caption: string;
  category: string;
  createdAt: number;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: "contact-form" | "plan-trip" | "package";
  status: "new" | "read" | "replied";
  createdAt: number;
}

export interface SiteSettings {
  whatsapp: string;
  phone: string;
  phone2: string;
  phone3: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  youtube: string;
  locationUrl: string;
}

export interface AboutSettings {
  founderName: string;
  founderTitle: string;
  founderBio: string;
  founderPhoto: string;
  yearsCardPhoto: string;
  highlights: {
    id: string;
    name: string;
    desc: string;
    photo: string;
  }[];
}

// ──────── Default values (shown before DB loads) ────────
export const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "919906757390",
  phone: "+91 99067 57390",
  phone2: "+91 97961 08210",
  phone3: "+91 70060 37094",
  email: "talibstourtravels@gmail.com",
  address: "Srinagar, Kashmir, India",
  instagram: "https://www.instagram.com/talibs_tour_and_travels_kashmr",
  facebook: "https://share.google/HgsCsPPZWhrGklNyx",
  youtube: "https://youtube.com/@talibs-tour-and-travels-kmr?si=tAPI2WKXlod6bSMg",
  locationUrl: "https://maps.app.goo.gl/BCWkcgzJL7n5FDQ36",
};

export const DEFAULT_ABOUT: AboutSettings = {
  founderName: "Talib",
  founderTitle: "Founder & Lead Guide",
  founderBio: "A born-and-raised Kashmiri with an unmatched eye for hidden gems and a heart for hospitality.",
  founderPhoto: "",
  yearsCardPhoto: "",
  highlights: [
    { id: "h1", name: "Srinagar",  desc: "The summer capital with Dal Lake & gardens.", photo: "" },
    { id: "h2", name: "Gulmarg",   desc: "Skier's paradise with the world's highest gondola.", photo: "" },
    { id: "h3", name: "Pahalgam",  desc: "Valley of shepherds and emerald meadows.", photo: "" },
    { id: "h4", name: "Sonamarg",  desc: "Meadow of gold framed by mighty glaciers.", photo: "" },
  ],
};

// ──────── Row mappers (snake_case DB → camelCase TS) ────────
function mapPackage(row: Record<string, unknown>): AdminPackage {
  return {
    id:               String(row.id),
    name:             String(row.name),
    type:             String(row.type) as PackageType,
    price:            Number(row.price),
    duration:         String(row.duration ?? ""),
    shortDescription: String(row.short_description ?? ""),
    itinerary:        String(row.itinerary ?? ""),
    inclusions:       String(row.inclusions ?? ""),
    exclusions:       String(row.exclusions ?? ""),
    image:            String(row.image_url ?? ""),
    active:           Boolean(row.active),
    bestSeller:       Boolean(row.best_seller),
    createdAt:        new Date(String(row.created_at)).getTime(),
  };
}

function mapOffer(row: Record<string, unknown>): AdminOffer {
  return {
    id:          String(row.id),
    title:       String(row.title),
    discount:    String(row.discount),
    validUntil:  String(row.valid_until ?? ""),
    description: String(row.description ?? ""),
    bannerImage: String(row.banner_url ?? ""),
    active:      Boolean(row.active),
    createdAt:   new Date(String(row.created_at)).getTime(),
  };
}

function mapPhoto(row: Record<string, unknown>): GalleryPhoto {
  return {
    id:        String(row.id),
    url:       String(row.url),
    caption:   String(row.caption ?? ""),
    category:  String(row.category ?? "Other"),
    createdAt: new Date(String(row.created_at)).getTime(),
  };
}

function mapEnquiry(row: Record<string, unknown>): Enquiry {
  return {
    id:        String(row.id),
    name:      String(row.name),
    email:     String(row.email),
    phone:     String(row.phone ?? ""),
    message:   String(row.message),
    source:    String(row.source) as Enquiry["source"],
    status:    String(row.status) as Enquiry["status"],
    createdAt: new Date(String(row.created_at)).getTime(),
  };
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  return {
    whatsapp:  String(row.whatsapp  ?? DEFAULT_SETTINGS.whatsapp),
    phone:     String(row.phone     ?? DEFAULT_SETTINGS.phone),
    phone2:    String(row.phone2    ?? DEFAULT_SETTINGS.phone2),
    phone3:    String(row.phone3    ?? DEFAULT_SETTINGS.phone3),
    email:     String(row.email     ?? DEFAULT_SETTINGS.email),
    address:   String(row.address   ?? DEFAULT_SETTINGS.address),
    instagram: String(row.instagram ?? DEFAULT_SETTINGS.instagram),
    facebook:  String(row.facebook  ?? DEFAULT_SETTINGS.facebook),
    youtube:   String(row.youtube   ?? DEFAULT_SETTINGS.youtube),
    locationUrl: String(row.location_url ?? DEFAULT_SETTINGS.locationUrl),
  };
}

// ──────── PACKAGES ────────
export async function loadPackages(): Promise<AdminPackage[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("loadPackages:", error); return []; }
  return (data ?? []).map(mapPackage);
}

export async function savePackage(pkg: Omit<AdminPackage, "id" | "createdAt">): Promise<AdminPackage | null> {
  const row = {
    name: pkg.name, type: pkg.type, price: pkg.price,
    duration: pkg.duration, short_description: pkg.shortDescription,
    itinerary: pkg.itinerary, inclusions: pkg.inclusions,
    exclusions: pkg.exclusions, image_url: pkg.image || null,
    active: pkg.active, best_seller: pkg.bestSeller,
  };
  const { data, error } = await supabase.from("packages").insert(row).select().single();
  if (error) { console.error("savePackage:", error); return null; }
  return mapPackage(data);
}

export async function updatePackage(id: string, pkg: Partial<AdminPackage>): Promise<AdminPackage | null> {
  const row: Record<string, unknown> = {};
  if (pkg.name !== undefined)             row.name = pkg.name;
  if (pkg.type !== undefined)             row.type = pkg.type;
  if (pkg.price !== undefined)            row.price = pkg.price;
  if (pkg.duration !== undefined)         row.duration = pkg.duration;
  if (pkg.shortDescription !== undefined) row.short_description = pkg.shortDescription;
  if (pkg.itinerary !== undefined)        row.itinerary = pkg.itinerary;
  if (pkg.inclusions !== undefined)       row.inclusions = pkg.inclusions;
  if (pkg.exclusions !== undefined)       row.exclusions = pkg.exclusions;
  if (pkg.image !== undefined)            row.image_url = pkg.image || null;
  if (pkg.active !== undefined)           row.active = pkg.active;
  if (pkg.bestSeller !== undefined)       row.best_seller = pkg.bestSeller;
  const { data, error } = await supabase.from("packages").update(row).eq("id", id).select().single();
  if (error) { console.error("updatePackage:", error); return null; }
  return mapPackage(data);
}

export async function deletePackage(id: string): Promise<boolean> {
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) { console.error("deletePackage:", error); return false; }
  return true;
}

// ──────── OFFERS ────────
export async function loadOffers(): Promise<AdminOffer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("loadOffers:", error); return []; }
  return (data ?? []).map(mapOffer);
}

export async function saveOffer(offer: Omit<AdminOffer, "id" | "createdAt">): Promise<AdminOffer | null> {
  const row = {
    title: offer.title, discount: offer.discount,
    valid_until: offer.validUntil || null,
    description: offer.description,
    banner_url: offer.bannerImage || null,
    active: offer.active,
  };
  const { data, error } = await supabase.from("offers").insert(row).select().single();
  if (error) { console.error("saveOffer:", error); return null; }
  return mapOffer(data);
}

export async function updateOffer(id: string, offer: Partial<AdminOffer>): Promise<AdminOffer | null> {
  const row: Record<string, unknown> = {};
  if (offer.title !== undefined)       row.title = offer.title;
  if (offer.discount !== undefined)    row.discount = offer.discount;
  if (offer.validUntil !== undefined)  row.valid_until = offer.validUntil || null;
  if (offer.description !== undefined) row.description = offer.description;
  if (offer.bannerImage !== undefined) row.banner_url = offer.bannerImage || null;
  if (offer.active !== undefined)      row.active = offer.active;
  const { data, error } = await supabase.from("offers").update(row).eq("id", id).select().single();
  if (error) { console.error("updateOffer:", error); return null; }
  return mapOffer(data);
}

export async function deleteOffer(id: string): Promise<boolean> {
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) { console.error("deleteOffer:", error); return false; }
  return true;
}

// ──────── GALLERY ────────
export async function loadGallery(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("loadGallery:", error); return []; }
  return (data ?? []).map(mapPhoto);
}

export async function saveGalleryPhoto(photo: Omit<GalleryPhoto, "id" | "createdAt">): Promise<GalleryPhoto | null> {
  const { data, error } = await supabase
    .from("gallery")
    .insert({ url: photo.url, caption: photo.caption, category: photo.category })
    .select()
    .single();
  if (error) { console.error("saveGalleryPhoto:", error); return null; }
  return mapPhoto(data);
}

export async function deleteGalleryPhoto(id: string): Promise<boolean> {
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) { console.error("deleteGalleryPhoto:", error); return false; }
  return true;
}

// ──────── GALLERY CATEGORIES ────────
export async function loadGalleryCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("gallery_categories")
    .select("name")
    .order("id", { ascending: true });
  if (error) { console.error("loadGalleryCategories:", error); return []; }
  return (data ?? []).map((r: { name: string }) => r.name);
}

export async function addGalleryCategory(name: string): Promise<boolean> {
  const { error } = await supabase.from("gallery_categories").insert({ name });
  if (error) { console.error("addGalleryCategory:", error); return false; }
  return true;
}

export async function deleteGalleryCategory(name: string): Promise<boolean> {
  const { error } = await supabase.from("gallery_categories").delete().eq("name", name);
  if (error) { console.error("deleteGalleryCategory:", error); return false; }
  // Move orphaned photos to "Other"
  await supabase.from("gallery").update({ category: "Other" }).eq("category", name);
  return true;
}

// ──────── ENQUIRIES ────────
export async function loadEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("loadEnquiries:", error); return []; }
  return (data ?? []).map(mapEnquiry);
}

export async function addEnquiry(
  data: Omit<Enquiry, "id" | "status" | "createdAt">
): Promise<Enquiry | null> {
  const { data: row, error } = await supabase
    .from("enquiries")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: data.source,
      status: "new",
    })
    .select()
    .single();
  if (error) { console.error("addEnquiry:", error); return null; }
  return mapEnquiry(row);
}

export async function updateEnquiryStatus(
  id: string,
  status: Enquiry["status"]
): Promise<boolean> {
  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);
  if (error) { console.error("updateEnquiryStatus:", error); return false; }
  return true;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("enquiries")
    .delete()
    .eq("id", id);
  if (error) { console.error("deleteEnquiry:", error); return false; }
  return true;
}

export async function countNewEnquiries(): Promise<number> {
  const { count, error } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");
  if (error) return 0;
  return count ?? 0;
}

// ──────── SITE SETTINGS ────────
export async function loadSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error || !data) return DEFAULT_SETTINGS;
  return mapSettings(data);
}

export async function saveSettings(settings: SiteSettings): Promise<boolean> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: 1,
      whatsapp: settings.whatsapp,
      phone: settings.phone,
      phone2: settings.phone2,
      phone3: settings.phone3,
      email: settings.email,
      address: settings.address,
      instagram: settings.instagram,
      facebook: settings.facebook,
      youtube: settings.youtube,
      location_url: settings.locationUrl,
      updated_at: new Date().toISOString(),
    });
  if (error) { console.error("saveSettings:", error); return false; }
  return true;
}

// ──────── ABOUT SETTINGS ────────
export async function loadAbout(): Promise<AboutSettings> {
  const [settingsRes, highlightsRes] = await Promise.all([
    supabase.from("about_settings").select("*").eq("id", 1).single(),
    supabase.from("about_highlights").select("*").order("sort_order", { ascending: true }),
  ]);
  const s = settingsRes.data;
  const h = highlightsRes.data ?? [];
  return {
    founderName:    String(s?.founder_name    ?? DEFAULT_ABOUT.founderName),
    founderTitle:   String(s?.founder_title   ?? DEFAULT_ABOUT.founderTitle),
    founderBio:     String(s?.founder_bio     ?? DEFAULT_ABOUT.founderBio),
    founderPhoto:   String(s?.founder_photo   ?? ""),
    yearsCardPhoto: String(s?.years_card_photo ?? ""),
    highlights: h.map((row: Record<string, unknown>) => ({
      id:    String(row.id),
      name:  String(row.name),
      desc:  String(row.description ?? ""),
      photo: String(row.photo_url ?? ""),
    })),
  };
}

export async function saveAbout(about: AboutSettings): Promise<boolean> {
  const { error: settingsErr } = await supabase
    .from("about_settings")
    .upsert({
      id: 1,
      founder_name:     about.founderName,
      founder_title:    about.founderTitle,
      founder_bio:      about.founderBio,
      founder_photo:    about.founderPhoto || null,
      years_card_photo: about.yearsCardPhoto || null,
      updated_at:       new Date().toISOString(),
    });
  if (settingsErr) { console.error("saveAbout settings:", settingsErr); return false; }

  // Upsert highlights
  for (const h of about.highlights) {
    await supabase.from("about_highlights").upsert({
      id:          h.id,
      name:        h.name,
      description: h.desc,
      photo_url:   h.photo || null,
    });
  }
  return true;
}

export async function addAboutHighlight(h: { name: string; desc: string; photo: string }): Promise<string | null> {
  const { data, error } = await supabase
    .from("about_highlights")
    .insert({ name: h.name, description: h.desc, photo_url: h.photo || null })
    .select("id")
    .single();
  if (error) { console.error("addAboutHighlight:", error); return null; }
  return String(data.id);
}

export async function deleteAboutHighlight(id: string): Promise<boolean> {
  const { error } = await supabase.from("about_highlights").delete().eq("id", id);
  if (error) { console.error("deleteAboutHighlight:", error); return false; }
  return true;
}

// ──────── DASHBOARD COUNTS ────────
export async function getDashboardCounts(): Promise<{
  packages: number; offers: number; gallery: number; enquiries: number; newEnquiries: number;
}> {
  const [pkg, off, gal, enq, newEnq] = await Promise.all([
    supabase.from("packages").select("*", { count: "exact", head: true }),
    supabase.from("offers").select("*", { count: "exact", head: true }),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return {
    packages:     pkg.count    ?? 0,
    offers:       off.count    ?? 0,
    gallery:      gal.count    ?? 0,
    enquiries:    enq.count    ?? 0,
    newEnquiries: newEnq.count ?? 0,
  };
}

// ──────── Package type badge colours (unchanged) ────────
export const PACKAGE_TYPES: PackageType[] = [
  "Honeymoon", "Family", "Adventure", "Pilgrimage", "Budget", "Luxury",
];

export function typeColor(type: PackageType): { bg: string; fg: string } {
  switch (type) {
    case "Honeymoon":   return { bg: "#FCE7F3", fg: "#9D174D" };
    case "Family":      return { bg: "#DBEAFE", fg: "#1E3A8A" };
    case "Adventure":   return { bg: "#FEF9C3", fg: "#854D0E" };
    case "Pilgrimage":  return { bg: "#FEF3C7", fg: "#78350F" };
    case "Budget":      return { bg: "#E0E7FF", fg: "#312E81" };
    case "Luxury":      return { bg: "#F3E8FF", fg: "#581C87" };
  }
}

// ──────── Legacy compat shims (remove after admin pages updated) ────────
export const PACKAGES_KEY   = "talibs_packages";
export const OFFERS_KEY     = "talibs_offers";
export const GALLERY_KEY    = "talibs_gallery";
export const ENQUIRIES_KEY  = "talibs_enquiries";
export const SETTINGS_KEY   = "talibs_settings";
export const ABOUT_SETTINGS_KEY = "talibs_about";
export function countKey(_key: string): number { return 0; }
export function compressImage(file: File, maxW = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
