import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut,UserCircle } from "lucide-react";
import Link from "next/link";

export function UserNav({ onLogout }: { onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <UserCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          <Link href="/profile">Profile</Link>
=======
          <Link href="/dashboard">Profile</Link>
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
          <Link href="/dashboard">Profile</Link>
>>>>>>> origin/main
=======
          <Link href="/profile">Profile</Link>
>>>>>>> 071bc5d (v5)
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
