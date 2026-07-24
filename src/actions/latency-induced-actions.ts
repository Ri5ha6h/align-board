"use server";

import { getErrorMessage } from "@/utils/action-result";
import type { InducedChartType, LatencyTableType } from "@/utils/common-types";

import { getUserAction } from "./auth-actions";
import { mainRequestAction } from "./main-actions";

// tracking actions

// get latency action
export const getLatencyAction = async ({
	env,
	mode,
	carriers,
	queue,
	referenceType,
}: {
	env: string;
	mode: string;
	carriers: string[];
	queue: string;
	referenceType: string;
}) => {
	try {
		const { data, success } = await getUserAction();

		if (!success) {
			throw new Error("User not found.");
		}

		let reqData = {};
		if (referenceType === "ALL") {
			reqData = {
				type: "GET_LATENCY",
				username: data.username,
				env: env.toUpperCase(),
				mode: mode.toUpperCase(),
				carriers: carriers,
				queue: queue,
				referenceType: "",
			};
		} else {
			reqData = {
				type: "GET_LATENCY",
				username: data.username,
				env: env.toUpperCase(),
				mode: mode.toUpperCase(),
				carriers: carriers,
				queue: queue,
				referenceType: referenceType,
			};
		}

		const res = await mainRequestAction<LatencyTableType[]>(reqData);

		if (!res?.success && (res?.data.includes("timed") || res?.data.includes("trusted"))) {
			throw new Error(res.data);
		}

		if (!res?.success) {
			const dataErr = res?.data;
			const errMsg = dataErr.includes("pass one carrier")
				? dataErr
				: dataErr.includes("No data exists for this query")
					? dataErr
					: "Something went wrong while fetching latency.";
			throw new Error(errMsg);
		}

		return {
			data: res?.data,
			success: true as const,
		};
	} catch (error: unknown) {
		return {
			data: getErrorMessage(error),
			success: false as const,
		};
	}
};

// get induced action
export const getInducedAction = async ({
	env,
	mode,
	carriers,
	year,
}: {
	env: string;
	mode: string;
	carriers: string[];
	year: string;
}) => {
	try {
		const { data, success } = await getUserAction();

		if (!success) {
			throw new Error("User not found.");
		}

		const reqData = {
			type: "GET_INDUCED_LATENCY",
			username: data.username,
			env: env.toUpperCase(),
			mode: mode.toUpperCase(),
			carriers: carriers,
			year: year,
		};

		const res = await mainRequestAction<InducedChartType[]>(reqData);

		if (!res?.success && (res?.data.includes("timed") || res?.data.includes("trusted"))) {
			throw new Error(res.data);
		}

		if (!res?.success) {
			const dataErr = res?.data;
			const errMsg = dataErr.includes("least one carrier")
				? dataErr
				: dataErr.includes("least one month")
					? dataErr
					: "Something went wrong while fetching summary.";
			throw new Error(errMsg);
		}

		return {
			data: res?.data,
			success: true as const,
		};
	} catch (error: unknown) {
		return {
			data: getErrorMessage(error),
			success: false as const,
		};
	}
};
