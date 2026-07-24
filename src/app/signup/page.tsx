import type { Metadata } from "next";

import SignUp from "./sign-up";

export const metadata: Metadata = {
	title: "Alignbits - Tracking Sign Up",
	description:
		"Create an Alignbits Tracking account to monitor status, handoffs, exceptions, and delivery history.",
};

const SignUpPage = () => {
	return (
		<>
			<SignUp />
		</>
	);
};

export default SignUpPage;
