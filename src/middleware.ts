import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifySessionToken } from "@/lib/session";

const getRedirectOrigin = (request: NextRequest) => {
	if (process.env.APP_ORIGIN) {
		return new URL(process.env.APP_ORIGIN).origin;
	}

	const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
	if (!forwardedHost) {
		return request.nextUrl.origin;
	}

	const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
	const protocol = forwardedProto === "http" ? "http" : "https";

	return `${protocol}://${forwardedHost}`;
};

const redirectTo = (pathname: string, request: NextRequest) =>
	NextResponse.redirect(new URL(pathname, getRedirectOrigin(request)));

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const authPaths = ["/signin", "/signup"];
	const isAuthPath = authPaths.includes(path);
	const token = request.cookies.get("token")?.value;
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
	} else if (!hasValidSession && path !== "/signin") {
		response = redirectTo("/signin", request);
	}

	if (token && !hasValidSession) {
		response.cookies.delete("token");
	}

	return response;
}

export const config = {
	matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
};
