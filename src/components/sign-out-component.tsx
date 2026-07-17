"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signOutAction } from "@/actions/auth-actions";
import { SESSION_ACTIVITY_STORAGE_KEY } from "@/lib/session-constants";

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
			try {
				localStorage.removeItem(SESSION_ACTIVITY_STORAGE_KEY);
			} catch {
				// Continue redirecting when browser storage is unavailable.
			}
			router.replace("/signin");
			router.refresh();
			toast.success("Sign out successful");
		}
	};

	return (
		<Button variant="ghost" onClick={handleSignOut}>
			Sign Out
		</Button>
	);
};
