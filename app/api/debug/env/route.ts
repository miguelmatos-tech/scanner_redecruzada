import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "N/A",
    urlLength: (process.env.SUPABASE_URL || "").length,
    keyLength: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").length,
    vercel: !!process.env.VERCEL,
  });
}
