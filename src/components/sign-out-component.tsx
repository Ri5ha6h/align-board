"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOutAction } from "@/actions/auth-actions";
import { Button } from "./ui/button";

export const SignOutComponent = () => {
	const router = useRouter();
	const handleSignOut = async () => {
		const { data, success } = await signOutAction();
		if (!success) {
			toast.error("Uh oh! Something went wrong, Sign out failed.", {
				description: data,
			});
		} else {
			router.push("/signin");
			toast.success("Sign out successful");
		}
	};

	return (
		<Button variant="ghost" onClick={handleSignOut}>
			Sign Out
		</Button>
	);
};
