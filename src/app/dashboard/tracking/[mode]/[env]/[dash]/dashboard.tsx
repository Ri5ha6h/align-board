"use client";

import MainHistoryComponent from "@/components/tracking/history/history-component";
import MainInducedComponent from "@/components/tracking/induced/induced-component";
import MainLatencyComponent from "@/components/tracking/latency/latency-component";
import MainReferenceComponent from "@/components/tracking/reference/reference-component";
import MainStatusComponent from "@/components/tracking/status/status-component";
import MainSummaryComponent from "@/components/tracking/summary/summary-component";

const DashboardPage = ({ dash, isAlignUser }: { dash: string; isAlignUser: boolean }) => {
	return (
		<div className="h-full w-full">
			{dash === "status" ? (
				<MainStatusComponent isAlignUser={isAlignUser} />
			) : dash === "summary" ? (
				<MainSummaryComponent isAlignUser={isAlignUser} />
			) : dash === "history" ? (
				<MainHistoryComponent />
			) : dash === "latency" ? (
				<MainLatencyComponent />
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
