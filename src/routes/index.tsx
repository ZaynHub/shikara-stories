import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Talib's Tour & Travels — Your Gateway to Paradise in Kashmir" },
      { name: "description", content: "Curated Kashmir tours, honeymoons, pilgrimages, houseboats and car rentals by Talib's Tour & Travels — your gateway to paradise." },
      { property: "og:title", content: "Talib's Tour & Travels — Discover Paradise on Earth" },
      { property: "og:description", content: "Experience the magic of Kashmir with bespoke journeys crafted by Talib's Tour & Travels." },
    ],
  }),
  component: Home,
});
