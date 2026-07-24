"use client";

import {
	AuthCredentialsFields,
	AuthFormActions,
	AuthRouteShell,
} from "@/components/auth/auth-route-shell";
import { Form } from "@/components/ui/form";
import type { AuthType } from "@/utils/common-types";
import { useSignInSubmitMutation } from "@/utils/mutation";
import { useAuthForm } from "@/utils/schema";

const SignIn = () => {
	const form = useAuthForm();
	const { mutate: serverSignIn, isPending: signInPending } = useSignInSubmitMutation(form);

	const onSubmit = (data: AuthType) => serverSignIn(data);

	return (
		<AuthRouteShell
			formIntro="Use your Alignbits tracking account."
			formTitle="Sign in"
			heroDescription="Enter the operations board for live status, handoffs, exceptions, and delivery history."
			heroTitle={["Know where", "things stand."]}
			legalCopy="Access is limited to authorized operations personnel."
			statusLabel="Systems operational"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<AuthCredentialsFields
						form={form}
						passwordAutoComplete="current-password"
						passwordPlaceholder="Enter your password"
					/>
					<AuthFormActions
						actionLabel="Continue to board"
						isPending={signInPending}
						linkHref="/signup"
						linkLabel="Create account"
						metadataText="Secure workspace access"
						pendingLabel="Signing in..."
					/>
				</form>
			</Form>
		</AuthRouteShell>
	);
};

export default SignIn;
