import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    return NextResponse.json({
      exists: !!existingUser,
    })
  } catch (error) {
    console.error("Check email error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
