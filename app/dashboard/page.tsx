import { WelcomeHero } from "@/components/user/welcome-hero"
import { CategorySection } from "@/components/user/category-section"
import { PopularDishes } from "@/components/user/popular-dishes"

export default function UserDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeHero />
      <div className="mt-12 space-y-12">
        <CategorySection />
        <PopularDishes />
      </div>
    </div>
  )
}

