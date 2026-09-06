import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isTransientAuthError } from "@/lib/supabase/auth-errors";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Optimistic check only — the secure check lives in the server layout / DAL.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) return response;

  // A hiccup (network, rate limit, auth-server 5xx) is not a sign-out: keep
  // the session cookie and let the request through — the DAL check on the
  // page still protects it, and the next request retries the refresh.
  if (error && isTransientAuthError(error)) return response;

  // Definitive: no session, or the refresh token is invalid/revoked.
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  const redirect = NextResponse.redirect(url);
  // Carry over any cookie updates (e.g. removal of dead tokens) so the
  // browser doesn't keep retrying a corrupt session on every request.
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
