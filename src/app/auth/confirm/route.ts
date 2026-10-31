import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Email confirmation link target. Supports both Supabase flows:
 * - default hosted links (PKCE): ?code=...
 * - custom email templates: ?token_hash=...&type=...
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/en/app";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/en/app";

  const supabase = await createClient();
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }
  const locale = next.split("/")[1] === "fr" ? "fr" : "en";
  return NextResponse.redirect(new URL(`/${locale}/sign-in`, origin));
}
