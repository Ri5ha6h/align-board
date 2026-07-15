import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInAction, signUpAction } from "@/actions/auth-actions";
import {
	closeStatusAction,
	createUpdateStatusAction,
	deleteStatusAction,
} from "@/actions/status-summary-actions";
import type { AuthType, ParamType, StatusValueInternal } from "./common-types";

// auth mutations

// mutation for signUp
export const useSignUpSubmitMutation = (form: any) => {
	const router = useRouter();
	const submit = useMutation({
		mutationFn: async (data: AuthType) => await signUpAction(data),
		onSuccess: (data) => {
			if (!data.success) {
				toast.error("Uh oh! Something went wrong, Sign up failed.", {
					description: data.data,
				});
			} else {
				form.reset({ username: "", password: "" });
				router.push("/signin");
				toast.success("Sign up Successful.");
			}
		},
		onError: (error: any) => {
			toast.error("Uh oh! Something went wrong, Sign up failed.", {
				description: error.message,
			});
		},
	});

	return submit;
};

// mutation for signIn
export const useSignInSubmitMutation = (form: any) => {
	const router = useRouter();
	const submit = useMutation({
		mutationFn: async (data: AuthType) => await signInAction(data),
		onSuccess: (data) => {
			if (!data.success) {
				toast.error("Uh oh! Something went wrong, Sign in failed.", {
					description: data.data,
				});
			} else {
				form.reset({ username: "", password: "" });
				router.push("/dashboard");
				toast.success("Sign In Successful.");
			}
		},
		onError: (error: any) => {
			toast.error("Uh oh! Something went wrong, Sign in failed.", {
				description: error.message,
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
	form: any,
	state: string,
	statusKey: string,
	tableType: string,
	setOpen: any,
) => {
	const queryClient = useQueryClient();
	const submit = useMutation({
		mutationFn: async (data: StatusValueInternal) =>
			await createUpdateStatusAction({
				...data,
				type: state,
				statusKey: statusKey,
			}),
		onSuccess: async (data) => {
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
						rca: "",
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
		onError: (error: any) => {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
			});
		},
	});

	return submit;
};

// close status mutation
export const useCloseStatusMutation = (
	form: any,
	setOpen: any,
	params: ParamType,
	carrier: string,
) => {
	const queryClient = useQueryClient();
	const submit = useMutation({
		mutationFn: async (d: any) =>
			await closeStatusAction({
				env: params.env,
				mode: params.mode,
				carrier: carrier,
				statusKey: d.statusKey,
			}),
		onSuccess: async (data) => {
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
		onError: (error: any) => {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
			});
		},
	});

	return submit;
};

// delete status mutation
export const useDeleteStatusMutation = (
	form: any,
	setOpen: any,
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
		onError: (error: any) => {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
			});
		},
	});

	return submit;
};
