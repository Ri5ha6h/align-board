import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
	username: string;
	createdAt?: unknown;
}

type SessionClaims = Pick<SessionPayload, "username" | "createdAt">;

const getSessionSecret = () => {
	const secret = process.env.TOKEN_SECRET;

	if (!secret) {
		throw new Error("TOKEN_SECRET is not configured.");
	}

	return new TextEncoder().encode(secret);
};

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
