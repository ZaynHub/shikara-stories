import { useEffect, useState } from "react";
import logo from "@/assets/talib-logo.png.asset.json";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1500);
    const t2 = setTimeout(() => setVisible(false), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ background: "#0A1F44", opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}
      aria-hidden="true"
    >
      <img src={logo.url} alt="" className="h-20 w-auto object-contain mb-5 drop-shadow-lg" />
      <h2 style={{ fontFamily: '"Playfair Display", serif', color: "white", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em" }}>
        Talib's Tour & Travels
      </h2>
      <div className="mt-6 w-[220px] h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
        <div className="loader-bar-fill h-full" style={{ background: "#C9A84C" }} />
      </div>
      <p className="mt-4 text-xs tracking-[0.2em] uppercase" style={{ color: "#C9A84C" }}>
        Your Gateway to Paradise
      </p>
    </div>
  );
}
