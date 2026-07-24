import { zodResolver } from "@hookform/resolvers/zod";
import { format, getYear } from "date-fns";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import type { Option } from "@/components/multi-select";

import type { ParamType, StatusValueInternal } from "./common-types";

type SearchParamsReader = Pick<ReadonlyURLSearchParams, "get">;

function getDefaultDates() {
	const end = new Date();
	const start = new Date(end);
	start.setDate(start.getDate() - 1);
	return { end, start };
}

// auth schema

// combine signIn, signUp and forgot/reset
export const authSchema = z.object({
	username: z
		.string()
		.min(6, {
			message: "Username must be at least 6 characters.",
		})
		.max(20, {
			message: "Username must be at most 20 characters.",
		})
		.trim(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." })
		.regex(/[a-zA-Z]/, {
			message: "Password must contain at least one letter.",
		})
		.regex(/[0-9]/, {
			message: "Password must contain at least one number.",
		})
		.regex(/[^A-Za-z0-9]/, {
			message: "Password must contain at least one special character.",
		})
		.trim(),
});

export const useAuthForm = () => {
	const form = useForm<z.infer<typeof authSchema>>({
		resolver: zodResolver(authSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	return form;
};

// dashboards schema

// status
const statusFormSchema = z.object({
	env: z.string(),
	mode: z.string(),
	carrier: z.string(),
	status: z.string(),
	statusType: z.string(),
	issue: z.string(),
	impact: z.string(),
	jiraLink: z.string(),
	expectedResolutionDate: z.date(),
	resolution: z.string(),
});

export type StatusFormValues = z.infer<typeof statusFormSchema>;

export const useStatusForm = (
	state: string,
	params: ParamType,
	statusValue: StatusValueInternal,
) => {
	const { end } = getDefaultDates();
	let defaultVal = {
		env: params.env.toUpperCase(),
		mode: params.mode.toUpperCase(),
		carrier: "",
		status: "ACTIVE",
		statusType: "",
		issue: "",
		impact: "",
		jiraLink: "",
		expectedResolutionDate: new Date(format(end, "yyyy-MM-dd")),
		resolution: "IN-PROGRESS",
	};

	if (state === "EDIT") {
		defaultVal = {
			...defaultVal,
			env: params.env.toUpperCase(),
			mode: params.mode.toUpperCase(),
			carrier: statusValue.carrier,
			status: statusValue.status,
			statusType: statusValue.statusType,
			issue: statusValue.issue,
			impact: statusValue.impact,
			jiraLink: statusValue.jiraLink,
			expectedResolutionDate: new Date(statusValue.expectedResolutionDate),
			resolution: statusValue.resolution,
		};
	}

	const form = useForm<z.infer<typeof statusFormSchema>>({
		resolver: zodResolver(statusFormSchema),
		defaultValues: defaultVal,
	});

	return form;
};

// status close delete schema

const closeDeleteStatusFormSchema = z.object({
	statusKey: z.string(),
});

export type CloseDeleteStatusFormValues = z.infer<typeof closeDeleteStatusFormSchema>;

export const useCloseDeleteStatusForm = () => {
	const form = useForm<z.infer<typeof closeDeleteStatusFormSchema>>({
		resolver: zodResolver(closeDeleteStatusFormSchema),
		defaultValues: {
			statusKey: "",
		},
	});

	return form;
};

// summary
const summaryOptionSchema = z.object({
	label: z.string(),
	value: z.string(),
	disable: z.boolean().optional(),
});

const summaryFormSchema = z.object({
	carriers: z.array(summaryOptionSchema).max(5, "Please select up to 5 carriers"),
	queue: z.string(),
	range: z
		.object({
			from: z.date(),
			to: z.date(),
		})
		.optional(),
});

export type SummaryFormValues = z.infer<typeof summaryFormSchema>;

export const useSummaryForm = (newCarrOpt: Option[], searchParams: SearchParamsReader) => {
	const { end, start } = getDefaultDates();
	const form = useForm<z.infer<typeof summaryFormSchema>>({
		resolver: zodResolver(summaryFormSchema),
		defaultValues: {
			carriers: newCarrOpt,
			queue: searchParams.get("queue") || "NORMAL",
			range: {
				from: new Date(searchParams.get("from") || format(start, "yyyy-MM-dd")),
				to: new Date(searchParams.get("to") || format(end, "yyyy-MM-dd")),
			},
		},
	});

	return form;
};

// history schema
const historyFormSchema = z.object({
	subId: z.string(),
	historyType: z.string(),
	includeRange: z.string(),
	range: z
		.object({
			from: z.date(),
			to: z.date(),
		})
		.optional(),
});

export type HistoryFormValues = z.infer<typeof historyFormSchema>;

export const useHistoryForm = (searchParams: SearchParamsReader) => {
	const { end, start } = getDefaultDates();
	const form = useForm<z.infer<typeof historyFormSchema>>({
		resolver: zodResolver(historyFormSchema),
		defaultValues: {
			subId: searchParams.get("subId") || "",
			historyType: searchParams.get("historyType") || "DIFF",
			includeRange: searchParams.get("includeRange") || "NO",
			range: {
				from: new Date(searchParams.get("from") || format(start, "yyyy-MM-dd")),
				to: new Date(searchParams.get("to") || format(end, "yyyy-MM-dd")),
			},
		},
	});

	return form;
};

// latency schema
const latencyOptionSchema = z.object({
	label: z.string(),
	value: z.string(),
	disable: z.boolean().optional(),
});

const latencyFormSchema = z.object({
	carriers: z.array(latencyOptionSchema).max(5, "Please select up to 5 carriers"),
	queue: z.string(),
	refType: z.string(),
});

export type LatencyFormValues = z.infer<typeof latencyFormSchema>;

export const useLatencyForm = (newCarrOpt: Option[], searchParams: SearchParamsReader) => {
	const form = useForm<z.infer<typeof latencyFormSchema>>({
		resolver: zodResolver(latencyFormSchema),
		defaultValues: {
			carriers: newCarrOpt,
			queue: searchParams.get("queue") || "NORMAL",
			refType: searchParams.get("refType") || "ALL",
		},
	});

	return form;
};

// reference schema
const referenceAllFormSchema = z.object({
	carrier: z.string(),
	queue: z.string(),
	refType: z.string(),
	refStatus: z.string(),
});

export type ReferenceAllFormValues = z.infer<typeof referenceAllFormSchema>;

export const useReferenceAllForm = (params: ParamType, searchParams: SearchParamsReader) => {
	const requestedReferenceType = searchParams.get("refType");
	const form = useForm<z.infer<typeof referenceAllFormSchema>>({
		resolver: zodResolver(referenceAllFormSchema),
		defaultValues: {
			carrier: searchParams.get("carrier") || "",
			queue: searchParams.get("queue") || "NORMAL",
			refType: requestedReferenceType
				? requestedReferenceType
				: params.mode === "ocean"
					? "BOOKING"
					: params.mode === "air"
						? "AWB"
						: params.mode === "road"
							? "LTL"
							: params.mode === "intermodal"
								? "INTMD"
								: params.mode === "freight"
									? "HAWB"
									: params.mode === "load"
										? "LOAD"
										: "IMPORT",
			refStatus: searchParams.get("refStatus") || "ACTIVE",
		},
	});

	return form;
};

const referenceFormSchema = z.object({
	carrier: z.string(),
	reference: z.string(),
});

export type ReferenceFormValues = z.infer<typeof referenceFormSchema>;

export const useReferenceForm = (searchParams: SearchParamsReader) => {
	const form = useForm<z.infer<typeof referenceFormSchema>>({
		resolver: zodResolver(referenceFormSchema),
		defaultValues: {
			carrier: searchParams.get("refCarrier") || "",
			reference: searchParams.get("reference") || "",
		},
	});

	return form;
};

const referenceSubscriptionFormSchema = z.object({
	subscriptionId: z.string(),
});

export type ReferenceSubscriptionFormValues = z.infer<typeof referenceSubscriptionFormSchema>;

export const useReferenceSubscriptionForm = (searchParams: SearchParamsReader) => {
	const form = useForm<z.infer<typeof referenceSubscriptionFormSchema>>({
		resolver: zodResolver(referenceSubscriptionFormSchema),
		defaultValues: {
			subscriptionId: searchParams.get("subscriptionId") || "",
		},
	});

	return form;
};

// induced schema
const inducedOptionSchema = z.object({
	label: z.string(),
	value: z.string(),
	disable: z.boolean().optional(),
});

const inducedFormSchema = z.object({
	carriers: z.array(inducedOptionSchema).max(3, "Please select up to 3 carriers"),
	year: z.string(),
});

export type InducedFormValues = z.infer<typeof inducedFormSchema>;

export const useInducedForm = (newCarrOpt: Option[], searchParams: SearchParamsReader) => {
	const form = useForm<z.infer<typeof inducedFormSchema>>({
		resolver: zodResolver(inducedFormSchema),
		defaultValues: {
			carriers: newCarrOpt,
			year: searchParams.get("year") || getYear(new Date()).toString(),
		},
	});

	return form;
};
