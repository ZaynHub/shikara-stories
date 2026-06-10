export type PackageType =
  | "Honeymoon"
  | "Family"
  | "Adventure"
  | "Pilgrimage"
  | "Budget"
  | "Luxury";

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
  image: string; // base64 data url
  active: boolean;
  bestSeller: boolean;
  createdAt: number;
}

export const PACKAGES_KEY = "talibs_packages";
export const OFFERS_KEY = "talibs_offers";
export const GALLERY_KEY = "talibs_gallery";
export const ENQUIRIES_KEY = "talibs_enquiries";

export const PACKAGE_TYPES: PackageType[] = [
  "Honeymoon",
  "Family",
  "Adventure",
  "Pilgrimage",
  "Budget",
  "Luxury",
];

export function loadPackages(): AdminPackage[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(PACKAGES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function savePackages(pkgs: AdminPackage[]) {
  window.localStorage.setItem(PACKAGES_KEY, JSON.stringify(pkgs));
}

export function countKey(key: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const arr = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export function typeColor(type: PackageType): { bg: string; fg: string } {
  switch (type) {
    case "Honeymoon": return { bg: "#FCE7F3", fg: "#9D174D" };
    case "Family": return { bg: "#DBEAFE", fg: "#1E3A8A" };
    case "Adventure": return { bg: "#DCFCE7", fg: "#14532D" };
    case "Pilgrimage": return { bg: "#FEF3C7", fg: "#78350F" };
    case "Budget": return { bg: "#E0E7FF", fg: "#312E81" };
    case "Luxury": return { bg: "#F3E8FF", fg: "#581C87" };
  }
}
