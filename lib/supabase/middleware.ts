import { type Profile } from "@/types/types";
import { createServerClient } from "@supabase/ssr";
import { unauthorized } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

const PRIVATE_ROUTES = new Set(["/profile"]);
const ADMIN_ROUTES = new Set(["/admin"]);

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  let profile: Profile | null = null;

  if (user?.sub) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.sub)
      .single();

    if (error) {
      console.error("Middleware: failed to get profile:", error.message);
    }

    profile = data;
  }

  // Redirect authenticated users away from /login to root
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isPrivateRoute = PRIVATE_ROUTES.has(request.nextUrl.pathname);
  const isAdminRoute = ADMIN_ROUTES.has(request.nextUrl.pathname);

  // Redirect unauthenticated users trying to access private or admin routes
  if (!user && (isPrivateRoute || isAdminRoute)) {
    console.log(
      `Anonymous user is trying to access ${
        isPrivateRoute ? "private" : "admin"
      } route`,
    );

    const loginUrl = new URL("/login", request.url);
    const currentPath =
      request.nextUrl.pathname + request.nextUrl.search + request.nextUrl.hash;
    loginUrl.searchParams.set("redirect_to", currentPath);

    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users without admin role trying to access admin routes
  if (isAdminRoute && (!user || !profile?.roles?.includes("admin"))) {
    console.log(
      `User ${user?.id} with roles ${profile?.roles} is trying to access admin route`,
    );

    unauthorized();
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!
  return supabaseResponse;
};
