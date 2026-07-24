import type { ReadonlyURLSearchParams } from "next/navigation";
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
import { useReferenceInfoQuery } from "@/utils/query";
import { sanitizeHistoryDataForDisplay } from "@/utils/sanitize-history-data";

interface ReferenceDrawerProps {
	onOpenChange: (open: boolean) => void;
	open: boolean;
	params: ParamType;
	resource: string;
	searchParams: Pick<ReadonlyURLSearchParams, "get">;
	title: string;
}

export function ReferenceDrawer(props: ReferenceDrawerProps) {
	return (
		<Sheet onOpenChange={props.onOpenChange} open={props.open}>
			<SheetContent className="dashboard-sheet dashboard-detail-sheet" side="right">
				<SheetHeader className="dashboard-detail-header">
					<SheetTitle>{props.title}</SheetTitle>
					<SheetDescription>
						Tracking reference summary and source payload.
					</SheetDescription>
				</SheetHeader>
				<ReferenceDetailContent {...props} enabled={props.open} />
			</SheetContent>
		</Sheet>
	);
}

function ReferenceDetailContent({
	enabled,
	params,
	resource,
	searchParams,
}: ReferenceDrawerProps & { enabled: boolean }) {
	const query = useReferenceInfoQuery(params, searchParams, resource, enabled);
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
					value: findDetailValue(data, ["subscriptionId", "subscription_id"]) ?? resource,
				},
				{
					label: params.mode === "terminal" ? "Terminal" : "Carrier",
					value:
						findDetailValue(data, ["carrier", "carrierCode", "terminal"]) ??
						searchParams.get("carrier"),
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
						findDetailValue(data, ["queue", "queueName"]) ?? searchParams.get("queue"),
				},
				{
					label: "Status",
					value:
						findDetailValue(data, ["status", "referenceStatus"]) ??
						searchParams.get("refStatus"),
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
			isRefreshing={query.isFetching && !query.isPending}
			onRetry={() => void query.refetch()}
			rawValue={data}
		/>
	);
}
