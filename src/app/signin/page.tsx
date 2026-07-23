import type { Metadata } from "next";

import SignIn from "./sign-in";

export const metadata: Metadata = {
	title: "Alignbits - Tracking Sign In",
	description:
		"Sign in to Alignbits Tracking to monitor status, handoffs, exceptions, and delivery history.",
};

const SignInPage = () => {
	return (
		<>
			<SignIn />
		</>
	);
};

export default SignInPage;
