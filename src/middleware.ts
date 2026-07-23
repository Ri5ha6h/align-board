import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { clearSessionCookie, verifySessionToken } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/session-constants";

const getRedirectOrigin = (request: NextRequest) => {
	if (process.env.APP_ORIGIN) {
		return new URL(process.env.APP_ORIGIN).origin;
	}

	if (process.env.NODE_ENV === "production") {
		throw new Error("APP_ORIGIN is required in production.");
	}

	return request.nextUrl.origin;
};

const redirectTo = (pathname: string, request: NextRequest) =>
	NextResponse.redirect(new URL(pathname, getRedirectOrigin(request)));

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const authPaths = ["/signin", "/signup"];
	const isAuthPath = authPaths.includes(path);
	const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
	let hasValidSession = false;

	if (token) {
		try {
			await verifySessionToken(token);
			hasValidSession = true;
		} catch {
			hasValidSession = false;
		}
	}

	let response = NextResponse.next();

	if (hasValidSession && (path === "/" || isAuthPath)) {
		response = redirectTo("/dashboard", request);
	} else if (!hasValidSession && !isAuthPath) {
		response = redirectTo("/signin", request);
	}

	if (token && !hasValidSession) {
		clearSessionCookie(response.cookies);
	}

	return response;
}

export const config = {
	matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
};
