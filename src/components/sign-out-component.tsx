"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { signOutAction } from "@/actions/auth-actions";
import { prepareSessionLogout } from "@/lib/session-activity-client";
import { SESSION_ACTIVITY_STORAGE_KEY } from "@/lib/session-constants";

import { Button } from "./ui/button";

export const SignOutComponent = ({ compact = false }: { compact?: boolean }) => {
	const router = useRouter();
	const [isSignOutPending, setIsSignOutPending] = useState(false);
	const isSignOutPendingRef = useRef(false);

	const handleSignOut = async () => {
		if (isSignOutPendingRef.current) {
			return;
		}

		isSignOutPendingRef.current = true;
		setIsSignOutPending(true);
		let didSignOut = false;
		let resumeSessionActivity: () => void = () => undefined;
		try {
			resumeSessionActivity = await prepareSessionLogout();
			const result = await signOutAction();

			if (!result.success) {
				resumeSessionActivity();
				toast.error("Uh oh! Something went wrong, Sign out failed.", {
					description: result.data,
				});
				return;
			}

			didSignOut = true;
			try {
				localStorage.removeItem(SESSION_ACTIVITY_STORAGE_KEY);
			} catch {
				// Continue redirecting when browser storage is unavailable.
			}

			router.replace("/signin");
			router.refresh();
			toast.success("Sign out successful");
		} catch {
			resumeSessionActivity();
			toast.error("Uh oh! Something went wrong, Sign out failed.");
		} finally {
			if (!didSignOut) {
				isSignOutPendingRef.current = false;
				setIsSignOutPending(false);
			}
		}
	};

	return (
		<Button variant="ghost" disabled={isSignOutPending} onClick={handleSignOut}>
			{compact ? <LogOut aria-hidden="true" /> : null}
			<span>{isSignOutPending ? "Signing out..." : "Sign Out"}</span>
		</Button>
	);
};
