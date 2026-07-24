import * as React from "react";

import { DashboardDetailBody } from "@/components/dashboard/dashboard-detail-sheet";
import { findDetailValue } from "@/components/dashboard/dashboard-detail-utils";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { ParamType } from "@/utils/common-types";
import { useHistoryFetchQuery } from "@/utils/query";
import { sanitizeHistoryDataForDisplay } from "@/utils/sanitize-history-data";

export interface HistoryDrawerSelection {
	buttonTitle: string;
	params: ParamType;
	resourceId: string;
	schedulerId: string;
	subscriptionId: string;
	title: string;
}

interface HistoryDrawerProps extends HistoryDrawerSelection {
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function HistoryDrawer(props: HistoryDrawerProps) {
	return (
		<Sheet onOpenChange={props.onOpenChange} open={props.open}>
			<SheetContent className="dashboard-sheet dashboard-detail-sheet" side="right">
				<SheetHeader className="dashboard-detail-header">
					<SheetTitle>{props.title}</SheetTitle>
					<SheetDescription>
						Crawl outcome summary and sanitized source payload.
					</SheetDescription>
				</SheetHeader>
				<HistoryDetailContent {...props} enabled={props.open} />
			</SheetContent>
		</Sheet>
	);
}

function HistoryDetailContent({
	buttonTitle,
	enabled,
	params,
	resourceId: rawResourceId,
	schedulerId,
	subscriptionId,
}: HistoryDrawerProps & { enabled: boolean }) {
	const resourceId = rawResourceId.includes("customfunction")
		? rawResourceId.replace("customfunction", "custom function")
		: rawResourceId;
	const query = useHistoryFetchQuery(params, schedulerId, subscriptionId, resourceId, enabled);
	const responseError =
		query.error?.message || (query.data && !query.data.success ? String(query.data.data) : "");
	const rawValue = query.data?.success ? query.data.data : undefined;
	const data = sanitizeHistoryDataForDisplay(rawValue);

	return (
		<DashboardDetailBody
			error={responseError}
			fields={[
				{ label: "Scheduler ID", value: schedulerId },
				{ label: "Subscription ID", value: subscriptionId },
				{
					label: "Transaction",
					value: findDetailValue(data, ["transactionId", "transaction_id"]),
				},
				{
					label: "Queue",
					value: findDetailValue(data, ["queue", "queueName"]),
				},
				{
					label: "Crawl Status",
					value: findDetailValue(data, ["crawlStatus", "crawl_status", "status"]),
				},
				{
					label: "Created",
					value: findDetailValue(data, ["createdAt", "insertionTime", "created_at"]),
				},
				{
					label: "Latency",
					value: findDetailValue(data, ["latencyInMinutes", "abLatencyInMinutes"]),
				},
				{ label: "Response", value: buttonTitle },
				{ label: "Error", value: findDetailValue(data, ["error", "errorMessage"]) },
			]}
			isLoading={query.isPending}
			isRefreshing={query.isFetching && !query.isPending}
			onRetry={() => void query.refetch()}
			rawValue={data}
		/>
	);
}
