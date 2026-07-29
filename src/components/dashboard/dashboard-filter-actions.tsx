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
		<div className="col-span-full mt-0.5 flex items-center justify-end gap-2 border-t border-dashboard-line pt-4 max-[651px]:w-full [&_button]:h-[38px] [&_button]:rounded-[2px] [&_button]:font-dashboard-code [&_button]:text-[9px] [&_button]:tracking-[0.06em] [&_button]:uppercase max-[651px]:[&_button]:flex-1 [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-45 [&_svg]:w-[13px]">
			<Button
				className="min-w-[88px] border-dashboard-line bg-transparent text-dashboard-mist"
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
				className="min-w-[152px]"
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
