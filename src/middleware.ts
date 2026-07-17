import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifySessionToken } from "@/lib/session";

const redirectTo = (pathname: string) =>
	new NextResponse(null, {
		status: 307,
		headers: { Location: pathname },
	});

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const publicPaths = ["/signin", "/signup"];
	const isPublic = publicPaths.includes(path);
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

	if (hasValidSession && (path === "/" || isPublic)) {
		response = redirectTo("/dashboard");
	} else if (!hasValidSession && !isPublic) {
		response = redirectTo("/signin");
	}

	if (token && !hasValidSession) {
		response.cookies.delete("token");
	}

	return response;
}

export const config = {
	matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
};
