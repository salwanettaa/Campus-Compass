import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, hasSupabaseEnv } from "./env";

/** Pages anyone can open without signing in. */
const PUBLIC_PATHS = [
  "/",
  ...(process.env.NODE_ENV !== "production" ? ["/design-system"] : []),
  "/api/health",
];
/** Auth pages: signed-in users are sent to /home instead. */
const GUEST_ONLY_PATHS = ["/login", "/register"];

function isPublic(pathname: string) {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    GUEST_ONLY_PATHS.includes(pathname) ||
    pathname.startsWith("/auth/")
  );
}

/** Redirect while keeping any refreshed session cookies. */
function redirectTo(
  request: NextRequest,
  pathname: string,
  from: NextResponse,
  search = "",
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = search;
  const response = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

/**
 * Refreshes the Supabase session cookie and applies route protection:
 * signed-out users can only see public pages; signed-in users skip the auth pages.
 * (Whether onboarding is completed is checked in the dashboard layout.)
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Without Supabase config (e.g. fresh clone) let public pages render.
  if (!hasSupabaseEnv()) {
    return response;
  }

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() validates the token with Supabase (unlike getSession()).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !isPublic(pathname)) {
    const next = `${pathname}${request.nextUrl.search}`;
    return redirectTo(
      request,
      "/login",
      response,
      `?next=${encodeURIComponent(next)}`,
    );
  }

  if (user && GUEST_ONLY_PATHS.includes(pathname)) {
    return redirectTo(request, "/home", response);
  }

  return response;
}
