import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth" // if you extracted authOptions
// or define it inline here if needed

const handler = NextAuth(authOptions)

export const GET = handler
export const POST = handler
