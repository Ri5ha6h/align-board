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
import { useReferenceInfoQuery } from "@/utils/query";
import { sanitizeHistoryDataForDisplay } from "@/utils/sanitize-history-data";

export function ReferenceDrawer({ ...props }) {
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
							Tracking reference summary and source payload.
						</SheetDescription>
					</SheetHeader>
					<ReferenceDetailContent {...props} enabled={open} />
				</SheetContent>
			</Sheet>
		</div>
	);
}

function ReferenceDetailContent({ ...props }) {
	const query = useReferenceInfoQuery(
		props.params,
		props.searchParams,
		props.resource,
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
				{
					label: "Subscription ID",
					value:
						findDetailValue(data, ["subscriptionId", "subscription_id"]) ??
						props.resource,
				},
				{
					label: props.params.mode === "terminal" ? "Terminal" : "Carrier",
					value:
						findDetailValue(data, ["carrier", "carrierCode", "terminal"]) ??
						props.searchParams.get("carrier"),
				},
				{
					label: "Reference Type",
					value: findDetailValue(data, ["referenceType", "refType"]),
				},
				{
					label: "Reference Number",
					value: findDetailValue(data, ["referenceNumber", "reference", "refNum"]),
				},
				{
					label: "Queue",
					value:
						findDetailValue(data, ["queue", "queueName"]) ??
						props.searchParams.get("queue"),
				},
				{
					label: "Status",
					value:
						findDetailValue(data, ["status", "referenceStatus"]) ??
						props.searchParams.get("refStatus"),
				},
				{
					label: "Created",
					value: findDetailValue(data, ["createdAt", "created_at"]),
				},
				{
					label: "Updated",
					value: findDetailValue(data, ["updatedAt", "modifiedAt", "updated_at"]),
				},
				{
					label: "Last Crawled",
					value: findDetailValue(data, ["lastCrawledAt", "last_crawled_at"]),
				},
				{ label: "Error", value: findDetailValue(data, ["error", "errorMessage"]) },
			]}
			isLoading={query.isPending}
			rawValue={data}
		/>
	);
}
