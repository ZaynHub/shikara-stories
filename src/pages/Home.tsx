import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sections from "@/components/Sections";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Sections />
      <Footer />
      <FloatingActions />
    </div>
  );
}
