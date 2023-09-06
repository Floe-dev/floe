import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log("Middlware: ", req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token && !token.error,
    },
  }
)

export const config = { matcher: ["/((?!register|signin|api).*)"], pages: { signIn: "/signin" } };
