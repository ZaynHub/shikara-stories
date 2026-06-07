import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DestinationsSection from "@/components/DestinationsSection";
import PackagesSection from "@/components/PackagesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import PlanTripForm from "@/components/PlanTripForm";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import SpecialOffer from "@/components/SpecialOffer";
import GalleryPreview from "@/components/GalleryPreview";
import HouseboatCarRental from "@/components/HouseboatCarRental";
import Sections from "@/components/Sections";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <DestinationsSection />
      <PackagesSection />
      <WhyChooseUs />
      <PlanTripForm />
      <TestimonialsMarquee />
      <SpecialOffer />
      <GalleryPreview />
      <HouseboatCarRental />
      <Sections />
      <Footer />
      <FloatingActions />
    </div>
  );
}
