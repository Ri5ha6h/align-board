"use client";

import {
	AuthCredentialsFields,
	AuthFormActions,
	AuthRouteShell,
} from "@/components/auth/auth-route-shell";
import { Form } from "@/components/ui/form";
import type { AuthType } from "@/utils/common-types";
import { useSignUpSubmitMutation } from "@/utils/mutation";
import { useAuthForm } from "@/utils/schema";

const SignUp = () => {
	const form = useAuthForm();
	const { mutate: serverSignUp, isPending: signUpPending } = useSignUpSubmitMutation(form);

	const onSubmit = (data: AuthType) => serverSignUp(data);

	return (
		<AuthRouteShell
			formIntro="Set up your Alignbits tracking account."
			formTitle="Create account"
			heroDescription="Create your operations account to track status, handoffs, exceptions, and delivery history."
			heroTitle={["Start with", "a clear view."]}
			legalCopy="Accounts are limited to authorized operations personnel."
			statusLabel="New operator access"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<AuthCredentialsFields
						form={form}
						passwordAutoComplete="new-password"
						passwordPlaceholder="Create your password"
					/>
					<AuthFormActions
						actionLabel="Create account"
						isPending={signUpPending}
						linkHref="/signin"
						linkLabel="Already registered?"
						metadataText="Encrypted account setup"
						pendingLabel="Creating account..."
					/>
				</form>
			</Form>
		</AuthRouteShell>
	);
};

export default SignUp;
