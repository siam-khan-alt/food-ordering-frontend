import CategoryShowcase from "../components/home/CategoryShowcase";
import CTABanner from "../components/home/CTABanner";
import FeaturedFoods from "../components/home/FeaturedFoods";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import SpecialOffers from "../components/home/SpecialOffers";
import StatsBar from "../components/home/StatsBar";
import Testimonials from "../components/home/Testimonials";
import WhyChooseUs from "../components/home/WhyChooseUs";

export default function Home() {
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