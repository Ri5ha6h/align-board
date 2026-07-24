"use server";

import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";

import {
	clearSessionCookie,
	createSessionToken,
	setSessionCookie,
	verifySessionToken,
	type SessionPayload,
} from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/session-constants";
import { getErrorMessage } from "@/utils/action-result";
import type { AuthType } from "@/utils/common-types";

import { mainRequestAction } from "./main-actions";

type GetUserResult = { data: SessionPayload; success: true } | { data: string; success: false };
type SignInRecord = SessionPayload & { password: string };

// auth actions

// sign up action
export const signUpAction = async ({ username, password }: AuthType) => {
	try {
		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		// find user
		const reqData = {
			type: "SIGN_UP",
			username: username,
			password: hashedPassword,
		};

		const res = await mainRequestAction<unknown>(reqData);

		if (!res?.success && (res?.data.includes("timed") || res?.data.includes("trusted"))) {
			throw new Error(res.data);
		}

		if (!res?.success) {
			throw new Error("User exists. Please sign in.");
		}

		return {
			data: "User created successfully",
			success: true,
		};
	} catch (error: unknown) {
		return {
			data: getErrorMessage(error),
			success: false,
		};
	}
};

// sign in action
export const signInAction = async ({ username, password }: AuthType) => {
	try {
		const cookieStore = await cookies();
		const testUserAliasUsername = process.env.TEST_USER_ALIAS_USERNAME;
		const testUserAliasPassword = process.env.TEST_USER_ALIAS_PASSWORD;
		const isTestUserAlias =
			Boolean(testUserAliasUsername && testUserAliasPassword) &&
			username === testUserAliasUsername &&
			password === testUserAliasPassword;
		let requestUsername = username;
		let passwordToCompare = password;

		if (isTestUserAlias) {
			const testUserBackendUsername = process.env.TEST_USER_BACKEND_USERNAME;
			const testUserBackendPassword = process.env.TEST_USER_BACKEND_PASSWORD;

			if (!testUserBackendUsername || !testUserBackendPassword) {
				throw new Error("Test user credentials are not configured.");
			}

			requestUsername = testUserBackendUsername;
			passwordToCompare = testUserBackendPassword;
		}

		const reqData = {
			type: "SIGN_IN",
			username: requestUsername,
		};

		const res = await mainRequestAction<SignInRecord>(reqData);

		if (!res?.success && (res?.data.includes("timed") || res?.data.includes("trusted"))) {
			throw new Error(res.data);
		}

		if (!res?.success) {
			throw new Error("User does not exist. Please sign up.");
		}

		// check if password matches
		const validPassword = await bcryptjs.compare(passwordToCompare, res?.data?.password);
		if (!validPassword) {
			throw new Error("Incorrect password. Please try again.");
		}

		// create token data
		const tokenData = {
			username: res?.data?.username,
			createdAt: res?.data?.createdAt,
		};

		// create token
		const token = await createSessionToken(tokenData);

		// generate cookies
		setSessionCookie(cookieStore, token);

		return {
			data: "Sign in Successful.",
			success: true,
		};
	} catch (error: unknown) {
		return {
			data: getErrorMessage(error),
			success: false,
		};
	}
};

// get user action
export const getUserAction = async (): Promise<GetUserResult> => {
	try {
		const cookieStore = await cookies();
		if (!cookieStore.has(SESSION_COOKIE_NAME)) {
			throw new Error("User not found.");
		}
		const data = cookieStore.get(SESSION_COOKIE_NAME);
		const user = await verifySessionToken(`${data?.value}`);
		return { data: user, success: true };
	} catch {
		return {
			data: "User not found.",
			success: false,
		};
	}
};

// refresh session action
export const refreshSessionAction = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (!token) {
		return { data: "Session expired.", success: false };
	}

	let session: SessionPayload;
	try {
		session = await verifySessionToken(token);
	} catch {
		return { data: "Session expired.", success: false };
	}

	const refreshedToken = await createSessionToken(session);
	setSessionCookie(cookieStore, refreshedToken);

	return { data: "Session refreshed.", success: true };
};

// sign out action
export const signOutAction = async () => {
	try {
		const cookieStore = await cookies();
		// delete cookie
		clearSessionCookie(cookieStore);
		return {
			data: "Sign out Successful.",
			success: true,
		};
	} catch (error: unknown) {
		return {
			data: getErrorMessage(error),
			success: false,
		};
	}
};
