import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) { },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Allow all authenticated users
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ["/dashboard", "/admin"],
};