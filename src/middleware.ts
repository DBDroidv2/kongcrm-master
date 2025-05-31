// export { default } from "next-auth/middleware"
// Using the above line would protect all routes by default.
// We want to be more specific.

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log("token: ", req.nextauth.token); // Useful for debugging

    // Example: Redirect admin users to a specific page
    // if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
    //   return NextResponse.rewrite(new URL("/denied", req.url));
    // }

    // If the request is for a protected route and the user is authenticated,
    // let the request proceed.
    // If not authenticated, `withAuth` will automatically redirect to the login page.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // The `authorized` callback determines if a user is authorized.
        // If a token exists, the user is considered authorized.
        // `withAuth` handles redirection to login if token is null.
        // You can add custom logic here, e.g., role-based access control.
        // For example, if `token?.role === "admin"`, they are authorized.
        // If `!token`, they are redirected.

        // For now, simply having a token means authorized for the matched routes.
        return !!token;
      },
    },
    // pages: { // Optional: if you want to override the default login page, but we already set this in authOptions
    //   signIn: '/login',
    //   error: '/auth/error', // Error code passed in query string as ?error=
    // }
  }
)

export const config = {
  // Matcher applies the middleware to these routes.
  // It supports regex-like syntax.
  // Positive lookaheads can be used for more complex matching if needed.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes, public)
     * - login (public)
     * - register (public)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (publicly accessible assets)
     *
     * This ensures that authentication is enforced on all other routes,
     * including `/`, `/customers`, `/activities`, `/profile`, etc.
     */
    '/((?!api/auth|login|register|_next/static|_next/image|favicon.ico|public|logo.png|images).*)',

    // Explicitly protect these specific top-level routes if the general matcher above isn't preferred.
    // However, the negative lookahead above is more comprehensive for protecting everything else.
    // If using the regex above, these specific paths are already covered.
    // If you prefer explicit listing:
    // '/customers/:path*',
    // '/activities/:path*',
    // '/profile/:path*',
    // '/' // Protect the home page too
  ],
};
