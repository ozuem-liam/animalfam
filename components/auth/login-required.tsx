"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Lock } from "lucide-react"
import Link from "next/link"

interface LoginRequiredProps {
  isOpen: boolean
  onClose: () => void
  action: string
  onSuccess?: () => void
}

export function LoginRequired({ isOpen, onClose, action, onSuccess }: LoginRequiredProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && onSuccess) {
      onSuccess()
      onClose()
    }
  }, [session, onSuccess, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Lock className="h-5 w-5 text-emerald-600" />
            Login Required
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6 py-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart className="h-10 w-10 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Sign in to {action}</h3>
            <p className="text-gray-600">
              You need to be logged in to proceed with your purchase. Create an account or sign in to continue.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/auth/signin">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>

          <div className="text-xs text-gray-500">Your cart items will be saved when you return</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
