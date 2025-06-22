import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

const { handlers } = NextAuth(authOptions);

export const GET = handlers.GET;
export const POST = handlers.POST;