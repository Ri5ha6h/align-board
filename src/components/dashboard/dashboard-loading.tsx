import { cn } from "@/lib/utils";

import { dashboardShimmer } from "./dashboard-styles";

export function DashboardSkeleton({ className }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cn(dashboardShimmer, "block rounded-[2px]", className)}
		/>
	);
}

export function DashboardTableSkeleton() {
	return (
		<div aria-label="Loading dashboard data" aria-live="polite" className="mt-6 space-y-px">
			{Array.from({ length: 6 }, (_, index) => (
				<div
					className="grid min-h-14 grid-cols-[1.1fr_0.8fr_2fr_1.4fr] items-center gap-5 border border-dashboard-line px-4"
					key={index}
				>
					<DashboardSkeleton className="h-3 w-3/4" />
					<DashboardSkeleton className="h-5 w-20" />
					<DashboardSkeleton className="h-3 w-full" />
					<DashboardSkeleton className="h-3 w-2/3" />
				</div>
			))}
		</div>
	);
}
