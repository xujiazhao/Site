import { DEFAULT_LANGUAGE, LANGUAGES } from "@/lib/i18n";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CHROME_DEVTOOLS_CONFIG_PATH =
  "/.well-known/appspecific/com.chrome.devtools.json";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === CHROME_DEVTOOLS_CONFIG_PATH ||
    LANGUAGES.some(
      (locale) => pathname === `/${locale}${CHROME_DEVTOOLS_CONFIG_PATH}`
    )
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const pathnameIsMissingLocale = LANGUAGES.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const prefersChinese = /zh/i.test(acceptLanguage.split(",")[0]);
    const locale = prefersChinese ? "zh" : DEFAULT_LANGUAGE;

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public folder)
     * - favicon (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets|favicon).*)",
  ],
};
