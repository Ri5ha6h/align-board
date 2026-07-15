"use client";

import MainHistoryComponent from "@/components/tracking/history/history-component";
import MainInducedComponent from "@/components/tracking/induced/induced-component";
import MainLatencyComponent from "@/components/tracking/latency/latency-component";
import MainReferenceComponent from "@/components/tracking/reference/reference-component";
import MainStatusComponent from "@/components/tracking/status/status-component";
import MainSummaryComponent from "@/components/tracking/summary/summary-component";

const DashboardPage = ({
	mode,
	dash,
	isAlignUser,
}: {
	mode: string;
	dash: string;
	isAlignUser: boolean;
}) => {
	if (
		(mode === "air" ||
			mode === "terminal" ||
			mode === "road" ||
			mode === "intermodal" ||
			mode === "freight" ||
			mode === "load") &&
		dash === "induced"
	) {
		return (
			<div className="mt-10 flex items-center justify-center font-semibold text-xl">
				Not available for AIR, TERMINAL, ROAD, INTERMODAL, FREIGHT, LOAD dashboards.
			</div>
		);
	}

	return (
		<div className="h-full w-full rounded-md bg-white p-4 text-primary">
			{dash === "status" ? (
				<MainStatusComponent isAlignUser={isAlignUser} />
			) : dash === "summary" ? (
				<MainSummaryComponent isAlignUser={isAlignUser} />
			) : dash === "history" ? (
				<MainHistoryComponent />
			) : dash === "latency" ? (
				<MainLatencyComponent mode={mode} />
			) : dash === "references" ? (
				<MainReferenceComponent />
			) : dash === "induced" ? (
				<MainInducedComponent />
			) : (
				<div>Coming soon...</div>
			)}
		</div>
	);
};

export default DashboardPage;
