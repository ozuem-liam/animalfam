  "use client"

  import { useState } from "react"
  import { signOut, useSession } from "next-auth/react"
  import { User, LogOut, Settings, ShoppingBag, Heart, Shield } from "lucide-react"
  import Link from "next/link"

  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Avatar, AvatarFallback } from "@/components/ui/avatar"

  export function UserMenu() {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    const handleSignOut = async () => {
      setIsLoading(true)
      await signOut({ callbackUrl: "/" })
    }

    if (status === "loading") {
      return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
    }

    if (!session) {
      return (
  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3">
    <Button
      variant="ghost"
      asChild
      className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm rounded-md hover:bg-aura-purple/20 focus:ring-2 focus:ring-aura-purple"
    >
      <Link href="/auth/signin">Sign in</Link>
    </Button>
    <Button
      asChild
      className="hidden md:inline-flex px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-md bg-aura-purple hover:bg-aura-purple/80 text-cosmos-light focus:ring-2 focus:ring-aura-purple"
    >
      <Link href="/auth/signup">Sign up</Link>
    </Button>
  </div>
    )
}

    const userInitials = `${session.user.firstName?.[0] || ""}${session.user.lastName?.[0] || ""}`.toUpperCase()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-emerald-600 text-white">{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.firstName} {session.user.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem> */}

          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>

          {/* <DropdownMenuItem asChild>
            <Link href="/wishlist" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Link>
          </DropdownMenuItem> */}

          {/* <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem> */}

          {session.user.role === "ADMIN" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
