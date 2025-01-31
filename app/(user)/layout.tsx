import { UserHeader } from "@/components/user/header"
import { UserFooter } from "@/components/user/footer"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow">{children}</main>
      <UserFooter />
    </div>
  )
}

