import type { NextRequest } from "next/server";

import {
	clearSessionCookie,
	createSessionToken,
	setSessionCookie,
	verifySessionToken,
} from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/session-constants";
import { createSessionResponse, isSameOriginSessionRequest } from "@/lib/session-route";

export async function POST(request: NextRequest) {
	if (!isSameOriginSessionRequest(request)) {
		return createSessionResponse(403);
	}

	const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!token) {
		return createSessionResponse(401);
	}

	try {
		const session = await verifySessionToken(token);
		const refreshedToken = await createSessionToken(session);
		const response = createSessionResponse(204);
		setSessionCookie(response.cookies, refreshedToken);
		return response;
	} catch {
		const response = createSessionResponse(401);
		clearSessionCookie(response.cookies);
		return response;
	}
}
