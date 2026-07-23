"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";

interface DashboardFilterActionsProps {
	canApply: boolean;
	isPending: boolean;
	onReset: () => void;
}

export function DashboardFilterActions({
	canApply,
	isPending,
	onReset,
}: DashboardFilterActionsProps) {
	return (
		<div className="dashboard-filter-actions">
			<Button
				className="dashboard-filter-reset"
				disabled={isPending}
				onClick={onReset}
				type="button"
				variant="outline"
			>
				<RotateCcw aria-hidden="true" />
				Reset
			</Button>
			<Button
				className="dashboard-filter-apply"
				disabled={!canApply || isPending}
				type="submit"
			>
				{isPending ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
				{isPending ? "Applying…" : "Apply Filters"}
			</Button>
		</div>
	);
}

export function useDashboardFilterNavigation() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = React.useTransition();

	const apply = React.useCallback(
		(query: string) => {
			startTransition(() => {
				router.push(`${pathname}${query ? `?${query}` : ""}`);
			});
		},
		[pathname, router],
	);

	const reset = React.useCallback(
		(resetForm: () => void) => {
			const nextParams = new URLSearchParams();
			const category = searchParams.get("category");
			if (category) {
				nextParams.set("category", category);
			}
			resetForm();
			startTransition(() => {
				const query = nextParams.toString();
				router.push(`${pathname}${query ? `?${query}` : ""}`);
			});
		},
		[pathname, router, searchParams],
	);

	return { apply, isPending, reset };
}
