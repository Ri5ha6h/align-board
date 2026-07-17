"use client";

import { toast } from "sonner";

import { SESSION_ACTIVITY_STORAGE_KEY, SESSION_LOGOUT_EVENT } from "@/lib/session-constants";

import { Button } from "./ui/button";

const handleSignOut = () => {
	try {
		localStorage.removeItem(SESSION_ACTIVITY_STORAGE_KEY);
	} catch {
		// Continue signing out when browser storage is unavailable.
	}

	window.dispatchEvent(new Event(SESSION_LOGOUT_EVENT));
	toast.info("Signing out...");
};

export const SignOutComponent = () => {
	return (
		<Button variant="ghost" onClick={handleSignOut}>
			Sign Out
		</Button>
	);
};
