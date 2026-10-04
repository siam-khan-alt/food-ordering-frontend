import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedFoods from "@/components/home/FeaturedFoods";
import SpecialOffers from "@/components/home/SpecialOffers";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <CategoryShowcase />
      <FeaturedFoods />
      <SpecialOffers />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
    </>
  );
}
