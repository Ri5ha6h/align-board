import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { signInAction, signUpAction } from "@/actions/auth-actions";
import {
	closeStatusAction,
	createUpdateStatusAction,
	deleteStatusAction,
} from "@/actions/status-summary-actions";
import { isSessionLogoutQuarantined } from "@/lib/session-logout-client";
import { getErrorMessage } from "@/utils/action-result";

import type { AuthType, ParamType, StatusValueInternal } from "./common-types";
import type { CloseDeleteStatusFormValues, StatusFormValues } from "./schema";

type ResettableForm<T extends FieldValues> = Pick<UseFormReturn<T>, "reset">;
type SetOpen = Dispatch<SetStateAction<boolean>>;

// auth mutations

// mutation for signUp
export const useSignUpSubmitMutation = (form: ResettableForm<AuthType>) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const submit = useMutation({
		mutationFn: async (data: AuthType) => await signUpAction(data),
		onSuccess: (data) => {
			if (!data.success) {
				toast.error("Uh oh! Something went wrong, Sign up failed.", {
					description: data.data,
				});
			} else {
				form.reset({ username: "", password: "" });
				queryClient.clear();
				router.push("/signin");
				toast.success("Sign up Successful.");
			}
		},
		onError: (error: unknown) => {
			toast.error("Uh oh! Something went wrong, Sign up failed.", {
				description: getErrorMessage(error),
			});
		},
	});

	return submit;
};

// mutation for signIn
export const useSignInSubmitMutation = (form: ResettableForm<AuthType>) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const submit = useMutation({
		mutationFn: async (data: AuthType) => await signInAction(data),
		onSuccess: (data) => {
			if (!data.success) {
				toast.error("Uh oh! Something went wrong, Sign in failed.", {
					description: data.data,
				});
			} else {
				form.reset({ username: "", password: "" });
				queryClient.clear();
				router.replace("/dashboard/tracking/ocean/prod/status");
				router.refresh();
				toast.success("Sign In Successful.");
			}
		},
		onError: (error: unknown) => {
			toast.error("Uh oh! Something went wrong, Sign in failed.", {
				description: getErrorMessage(error),
			});
		},
	});

	return submit;
};

// dashboard mutations

// status mutation

// create/update issue mutation
export const useStatusCUMutation = (
	params: ParamType,
	form: ResettableForm<StatusFormValues>,
	state: string,
	statusKey: string,
	tableType: string,
	setOpen: SetOpen,
) => {
	const queryClient = useQueryClient();
	const submit = useMutation({
		mutationFn: async (data: Omit<StatusValueInternal, "statusKey" | "type">) =>
			await createUpdateStatusAction({
				...data,
				type: state,
				statusKey: statusKey,
			}),
		onSuccess: async (data) => {
			if (isSessionLogoutQuarantined()) {
				return;
			}
			if (!data.success) {
				toast.error("Uh oh! Something went wrong.", {
					description: data.data,
				});
			} else {
				if (state === "CREATE") {
					await queryClient.invalidateQueries({
						queryKey: ["status", params.env, params.mode, tableType],
					});
					form.reset({
						env: params.env.toUpperCase(),
						mode: params.mode.toUpperCase(),
						carrier: "",
						status: "ACTIVE",
						statusType: "",
						issue: "",
						impact: "",
						jiraLink: "",
						expectedResolutionDate: new Date(),
						resolution: "IN-PROGRESS",
					});
					setOpen(false);
					toast.success("Status created successfully.");
				} else {
					await queryClient.invalidateQueries({
						queryKey: ["status", params.env, params.mode, tableType],
					});
					setOpen(false);
					toast.success("Status updated Successfully.");
				}
			}
		},
		onError: (error: unknown) => {
			if (isSessionLogoutQuarantined()) {
				return;
			}
			toast.error("Uh oh! Something went wrong.", {
				description: getErrorMessage(error),
			});
		},
	});

	return submit;
};

// close status mutation
export const useCloseStatusMutation = (
	form: ResettableForm<CloseDeleteStatusFormValues>,
	setOpen: SetOpen,
	params: ParamType,
	carrier: string,
) => {
	const queryClient = useQueryClient();
	const submit = useMutation({
		mutationFn: async (d: CloseDeleteStatusFormValues) =>
			await closeStatusAction({
				env: params.env,
				mode: params.mode,
				carrier: carrier,
				statusKey: d.statusKey,
			}),
		onSuccess: async (data) => {
			if (isSessionLogoutQuarantined()) {
				return;
			}
			if (!data.success) {
				toast.error("Uh oh! Something went wrong.", {
					description: data.data,
				});
			} else {
				await queryClient.invalidateQueries({
					queryKey: ["status", params.env, params.mode, "ACTIVE"],
				});
				form.reset({ statusKey: "" });
				setOpen(false);
				toast.success("Status closed successfully.");
			}
		},
		onError: (error: unknown) => {
			if (isSessionLogoutQuarantined()) {
				return;
			}
			toast.error("Uh oh! Something went wrong.", {
				description: getErrorMessage(error),
			});
		},
	});

	return submit;
};

// delete status mutation
export const useDeleteStatusMutation = (
	form: ResettableForm<CloseDeleteStatusFormValues>,
	setOpen: SetOpen,
	params: ParamType,
	carrier: string,
	tableType: string,
) => {
	const queryClient = useQueryClient();
	const submit = useMutation({
		mutationFn: async (statusKey: string) =>
			await deleteStatusAction({
				env: params.env,
				mode: params.mode,
				carrier: carrier,
				statusKey: statusKey,
			}),
		onSuccess: async (data) => {
			if (isSessionLogoutQuarantined()) {
				return;
			}
			if (!data.success) {
				toast.error("Uh oh! Something went wrong.", {
					description: data.data,
				});
			} else {
				await queryClient.invalidateQueries({
					queryKey: ["status", params.env, params.mode, tableType],
				});
				form.reset({ statusKey: "" });
				setOpen(false);
				toast.success("Status deleted successfully.");
			}
		},
		onError: (error: unknown) => {
			if (isSessionLogoutQuarantined()) {
				return;
			}
			toast.error("Uh oh! Something went wrong.", {
				description: getErrorMessage(error),
			});
		},
	});

	return submit;
};
