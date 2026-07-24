"use client";

import { Loader2, RotateCcw } from "lucide-react";

import { useDashboardFilterTransaction } from "@/components/dashboard/dashboard-filter-transaction";
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
				aria-busy={isPending}
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
	const transaction = useDashboardFilterTransaction();
	return {
		apply: transaction.begin,
		isPending: transaction.isPending,
		reset: transaction.reset,
	};
}
