import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const redirectTo = (pathname: string) =>
	new NextResponse(null, {
		status: 307,
		headers: { Location: pathname },
	});

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const publicPaths = ["/signin", "/signup"];
	const isPublic = publicPaths.includes(path);
	const token = request.cookies.has("token");

	if (token && (path === "/" || isPublic)) {
		return redirectTo("/dashboard");
	}

	if (!token && !isPublic) {
		return redirectTo("/signin");
	}
}

export const config = {
	matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
};
