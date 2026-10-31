import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { isLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/i18n/config";
import { resolveLocale } from "@/i18n/resolve-locale";

const handleI18n = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const [, firstSegment, secondSegment] = pathname.split("/");
  const urlLocale = isLocale(firstSegment) ? firstSegment : null;

  // Collect cookies Supabase wants to set (session refresh) so they survive any redirect.
  const pendingCookies: { name: string; value: string; options?: Parameters<NextResponse["cookies"]["set"]>[2] }[] = [];
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            pendingCookies.push({ name, value, options });
          });
        },
      },
    },
  );
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub ?? null;

  const withCookies = (response: NextResponse) => {
    pendingCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  };

  // No locale in the URL: apply profile > cookie > browser > English.
  if (!urlLocale) {
    let profileLocale: string | null = null;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("ui_locale")
        .eq("id", userId)
        .maybeSingle();
      profileLocale = profile?.ui_locale ?? null;
    }
    if (profileLocale) {
      const target = resolveLocale({
        profile: profileLocale,
        cookie: request.cookies.get(LOCALE_COOKIE)?.value,
        acceptLanguage: request.headers.get("accept-language"),
      });
      const url = request.nextUrl.clone();
      url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, target, { maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax", path: "/" });
      return withCookies(response);
    }
    // Anonymous or no saved preference: next-intl uses cookie > Accept-Language > default.
    return withCookies(handleI18n(request));
  }

  if (secondSegment === "app") {
    // Authenticated application area requires a session.
    if (!userId) {
      const url = request.nextUrl.clone();
      url.pathname = `/${urlLocale}/sign-in`;
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return withCookies(NextResponse.redirect(url));
    }
    // In the app, the explicit profile preference outranks the URL
    // (e.g. an English link opened by a user who chose French).
    const { data: profile } = await supabase.from("profiles").select("ui_locale").eq("id", userId).maybeSingle();
    if (isLocale(profile?.ui_locale) && profile.ui_locale !== urlLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${profile.ui_locale}${pathname.slice(urlLocale.length + 1)}`;
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, profile.ui_locale, { maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax", path: "/" });
      return withCookies(response);
    }
  }

  return withCookies(handleI18n(request));
}

export const config = {
  // Skip API routes, auth callbacks, Next internals and files with an extension.
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
