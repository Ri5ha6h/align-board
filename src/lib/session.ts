import type { JWTPayload } from "jose";
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export interface SessionPayload extends JWTPayload {
	username: string;
	createdAt?: unknown;
}

type SessionClaims = Pick<SessionPayload, "username" | "createdAt">;

type SessionCookieOptions = {
	httpOnly: true;
	maxAge: number;
	path: "/";
	sameSite: "lax";
	secure: boolean;
	expires?: Date;
};

type SessionCookieStore = {
	set: (name: string, value: string, options: SessionCookieOptions) => unknown;
};

export const SESSION_COOKIE_NAME = "token";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

const getSessionSecret = () => {
	const secret = process.env.TOKEN_SECRET;

	if (!secret) {
		throw new Error("TOKEN_SECRET is not configured.");
	}

	return new TextEncoder().encode(secret);
};

const getSessionCookieOptions = (): SessionCookieOptions => ({
	httpOnly: true,
	maxAge: SESSION_MAX_AGE_SECONDS,
	path: "/",
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
});

export const setSessionCookie = (cookieStore: SessionCookieStore, token: string) =>
	cookieStore.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

export const clearSessionCookie = (cookieStore: SessionCookieStore) =>
	cookieStore.set(SESSION_COOKIE_NAME, "", {
		...getSessionCookieOptions(),
		expires: new Date(0),
		maxAge: 0,
	});

export const createSessionToken = async ({ username, createdAt }: SessionClaims) =>
	new SignJWT({ username, createdAt })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1d")
		.sign(getSessionSecret());

export const verifySessionToken = async (token: string): Promise<SessionPayload> => {
	const { payload } = await jwtVerify(token, getSessionSecret(), {
		algorithms: ["HS256"],
	});

	if (typeof payload.username !== "string" || payload.username.length === 0) {
		throw new Error("Invalid session payload.");
	}

	return payload as SessionPayload;
};
