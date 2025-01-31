import Link from "next/link";
import { Button } from "components/ui/button";
import { HeroSection } from "components/user/hero-section";
import { FeaturedDishes } from "components/user/featured-dishes";
import { HowItWorks } from "components/user/how-it-works";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedDishes />
      <HowItWorks />
    </main>
  );
}
