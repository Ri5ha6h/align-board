"use server";

import axios from "axios";
import { headers } from "next/headers";

import type { ActionResult } from "@/utils/action-result";
import { getErrorMessage, getHttpStatus } from "@/utils/action-result";

// call the main request action
export const mainRequestAction = async <T>(
	reqBody: Record<string, unknown>,
): Promise<ActionResult<T>> => {
	try {
		const headersList = await headers();
		const authenticate = headersList.get("Postman-Token");

		if (authenticate) {
			throw new Error("Request is not from trusted source.");
		}

		const restUrl = process.env.REST_URL;
		const restUsername = process.env.REST_USERNAME;
		const restPassword = process.env.REST_PASSWORD;
		if (!restUrl || !restUsername || !restPassword) {
			throw new Error("Tracking service credentials are not configured.");
		}

		const mainObj = {
			method: "post",
			url: restUrl,
			timeout: 120000,
			auth: {
				username: restUsername,
				password: restPassword,
			},
			data: reqBody,
		};
		const mainRes = await axios<{
			response: { data: T; success: boolean };
		}>(mainObj);
		//console.log("main response", mainRes);

		if (!mainRes?.data?.response?.success) {
			throw new Error(String(mainRes.data?.response?.data));
		}

		return {
			data: mainRes?.data?.response?.data,
			success: true,
		};
	} catch (error: unknown) {
		//console.error("main error", error);
		const message = getErrorMessage(error);
		return {
			data: message.includes("timeout")
				? "Request timed out. Please try again."
				: message.includes("trusted")
					? "Request is not from trusted source."
					: getHttpStatus(error) === 504
						? "Gateway timed out, Please try again in a few minutes."
						: message,
			success: false,
		};
	}
};
