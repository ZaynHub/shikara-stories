// ─────────────────────────────────────────────────────────
//  Supabase Storage helper
//  Uploads images to the "media" bucket and returns public URLs
// ─────────────────────────────────────────────────────────
import { supabase } from "@/lib/supabase";

const BUCKET = "media";

/**
 * Resize + compress a File to JPEG, then upload to Supabase Storage.
 * Returns the public URL string, or null on failure.
 */
export async function uploadImage(
  file: File,
  folder: "packages" | "offers" | "gallery" | "about" = "gallery",
  maxWidth = 1200,
  quality = 0.82
): Promise<string | null> {
  // 1. Compress locally first
  let blob: Blob;
  try {
    blob = await compressToBlob(file, maxWidth, quality);
  } catch {
    blob = file; // fallback: upload original
  }

  // 2. Build a unique file path
  const ext = "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // 3. Upload to Supabase Storage
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });

  if (error) {
    console.error("uploadImage storage error:", error);
    return null;
  }

  // 4. Return the public URL
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage given its public URL.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  try {
    // Extract path after "/storage/v1/object/public/<bucket>/"
    const marker = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = publicUrl.slice(idx + marker.length);
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (e) {
    console.warn("deleteImage:", e);
  }
}

// ──────── Internal: Canvas compress ────────
function compressToBlob(file: File, maxW: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Canvas toBlob failed"));
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
