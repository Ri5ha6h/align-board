import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const NO_STORE_HEADERS = {
	"Cache-Control": "no-store, max-age=0",
	Pragma: "no-cache",
} as const;

const getAllowedOrigins = (request: NextRequest) => {
	const configuredOrigin = process.env.APP_ORIGIN;
	if (!configuredOrigin) {
		return new Set([request.nextUrl.origin]);
	}

	if (!URL.canParse(configuredOrigin)) {
		throw new Error("APP_ORIGIN must be a valid absolute URL.");
	}

	return new Set([request.nextUrl.origin, new URL(configuredOrigin).origin]);
};

export const isSameOriginSessionRequest = (request: NextRequest) => {
	const origin = request.headers.get("origin");
	return Boolean(origin && getAllowedOrigins(request).has(origin));
};

export const createSessionResponse = (status: number) =>
	new NextResponse(null, {
		headers: NO_STORE_HEADERS,
		status,
	});
