import * as React from "react";

import {
	DashboardDetailBody,
	findDetailValue,
} from "@/components/dashboard/dashboard-detail-sheet";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useHistoryFetchQuery } from "@/utils/query";
import { sanitizeHistoryDataForDisplay } from "@/utils/sanitize-history-data";

export function HistoryDrawer({ ...props }) {
	const [open, setOpen] = React.useState(false);
	return (
		<div className="flex items-center justify-center">
			<Sheet onOpenChange={setOpen} open={open}>
				<SheetTrigger asChild>
					<Button variant={props.variant}>{props.buttonTitle}</Button>
				</SheetTrigger>
				<SheetContent className="dashboard-sheet dashboard-detail-sheet" side="right">
					<SheetHeader>
						<SheetTitle>{props.title}</SheetTitle>
						<SheetDescription>
							Crawl outcome summary and sanitized source payload.
						</SheetDescription>
					</SheetHeader>
					<HistoryDetailContent {...props} enabled={open} />
				</SheetContent>
			</Sheet>
		</div>
	);
}

function HistoryDetailContent({ ...props }) {
	const resourceId = props.resourceId.includes("customfunction")
		? props.resourceId.replace("customfunction", "custom function")
		: props.resourceId;
	const query = useHistoryFetchQuery(
		props.params,
		props.schedulerId,
		props.subscriptionId,
		resourceId,
		props.enabled,
	);
	const responseError =
		query.error?.message || (query.data && !query.data.success ? String(query.data.data) : "");
	const rawValue = query.data?.success ? query.data.data : undefined;
	const data = sanitizeHistoryDataForDisplay(rawValue);

	return (
		<DashboardDetailBody
			error={responseError}
			fields={[
				{ label: "Scheduler ID", value: props.schedulerId },
				{ label: "Subscription ID", value: props.subscriptionId },
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
				{ label: "Response", value: props.buttonTitle },
				{ label: "Error", value: findDetailValue(data, ["error", "errorMessage"]) },
			]}
			isLoading={query.isPending}
			rawValue={data}
		/>
	);
}
