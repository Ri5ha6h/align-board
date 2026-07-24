import type { NextRequest } from "next/server";

import { clearSessionCookie } from "@/lib/session";
import { createSessionResponse, isSameOriginSessionRequest } from "@/lib/session-route";

export async function POST(request: NextRequest) {
	if (!isSameOriginSessionRequest(request)) {
		return createSessionResponse(403);
	}

	const response = createSessionResponse(204);
	clearSessionCookie(response.cookies);
	return response;
}
