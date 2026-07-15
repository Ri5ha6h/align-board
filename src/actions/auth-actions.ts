"use server";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { AuthType } from "@/utils/common-types";
import { mainRequestAction } from "./main-actions";

const TEST_USER_ALIAS_USERNAME = "testuser";
const TEST_USER_ALIAS_PASSWORD = "user@test123";

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

		const res: any = await mainRequestAction(reqData);

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
	} catch (error: any) {
		return {
			data: error.message,
			success: false,
		};
	}
};

// sign in action
export const signInAction = async ({ username, password }: AuthType) => {
	try {
		const cookieStore = await cookies();
		const isTestUserAlias =
			username === TEST_USER_ALIAS_USERNAME && password === TEST_USER_ALIAS_PASSWORD;
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

		const res: any = await mainRequestAction(reqData);

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
		const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
			expiresIn: "1d",
		});

		// generate cookies
		cookieStore.set("token", token, {
			httpOnly: true,
			maxAge: 60 * 60 * 24,
		});

		return {
			data: "Sign in Successful.",
			success: true,
		};
	} catch (error: any) {
		return {
			data: error.message,
			success: false,
		};
	}
};

// get user action
export const getUserAction = async () => {
	try {
		const cookieStore = await cookies();
		if (!cookieStore.has("token")) {
			throw new Error("User not found.");
		}
		const data = cookieStore.get("token");
		const user = jwt.decode(`${data?.value}`);
		return { data: user, success: true };
	} catch (error: any) {
		return {
			data: error.message,
			success: false,
		};
	}
};

// sign out action
export const signOutAction = async () => {
	try {
		const cookieStore = await cookies();
		// delete cookie
		cookieStore.set("token", "", { httpOnly: true, expires: new Date(0) });
		return {
			data: "Sign out Successful.",
			success: true,
		};
	} catch (error: any) {
		return {
			data: error.message,
			success: false,
		};
	}
};
