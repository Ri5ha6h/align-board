"use client";

import { LogOut } from "lucide-react";

import { useLogoutCoordinator } from "@/components/logout-coordinator";

import { Button } from "./ui/button";

export const SignOutComponent = ({ compact = false }: { compact?: boolean }) => {
	const { beginLogout } = useLogoutCoordinator();

	return (
		<Button aria-label="Sign Out" variant="ghost" onClick={() => beginLogout("manual")}>
			{compact ? <LogOut aria-hidden="true" /> : null}
			<span>Sign Out</span>
		</Button>
	);
};
