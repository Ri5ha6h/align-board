"use client";

import type { ColumnDef, SortingFn } from "@tanstack/react-table";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import * as React from "react";

import { DashboardTableSkeleton } from "@/components/dashboard/dashboard-loading";
import {
	DashboardWaitingState,
	useDashboardQueryReport,
} from "@/components/dashboard/dashboard-runtime";
import { dashboardDangerDataTag, dashboardDataTag } from "@/components/dashboard/dashboard-styles";
import { TableDataStaticComponent } from "@/components/data-table-static";
import {
	TableCellCustom,
	TableCellTooltip,
	TableHeadCustom,
} from "@/components/table/table-component";
import {
	HistoryDrawer,
	type HistoryDrawerSelection,
} from "@/components/tracking/history/history-drawer";
import {
	HistoryResourceCell,
	type HistoryResourceSelection,
} from "@/components/tracking/history/history-resource-cell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HistoryType, ParamType } from "@/utils/common-types";
import { formatUtcDateTime } from "@/utils/format-date";
import { useHistoryQuery } from "@/utils/query";

const sortScheduler: SortingFn<HistoryType> = (rowA, rowB) =>
	Number(rowA.original.k) - Number(rowB.original.k);

const sortStatus: SortingFn<HistoryType> = (rowA, rowB) => {
	const statusOrder = ["SUCCESS", "FAILED"];
	return (
		statusOrder.indexOf(rowA.original.v.crawl_status) -
		statusOrder.indexOf(rowB.original.v.crawl_status)
	);
};

interface HistoryDataProps {
	params: ParamType;
	searchParams: ReadonlyURLSearchParams;
}

export function HistoryTable() {
	const params = useParams<ParamType>();
	const searchParams = useSearchParams();

	if (!searchParams.get("subId")) {
		return (
			<DashboardWaitingState>Enter the Subscription Id to see history!</DashboardWaitingState>
		);
	}

	return <HistoryData params={params} searchParams={searchParams} />;
}

function HistoryData({ params, searchParams }: HistoryDataProps) {
	const historyQuery = useHistoryQuery(params, searchParams);
	const subscriptionId = searchParams.get("subId") ?? "";
	const [selection, setSelection] = React.useState<HistoryDrawerSelection | null>(null);

	useDashboardQueryReport({
		data: historyQuery.data,
		error: historyQuery.error,
		isFetching: historyQuery.isFetching,
		isPending: historyQuery.isPending,
		success: historyQuery.data?.success,
	});

	const openResource = React.useCallback(
		(resource: HistoryResourceSelection) => {
			setSelection({ ...resource, params, subscriptionId });
		},
		[params, subscriptionId],
	);

	const columns = React.useMemo<ColumnDef<HistoryType>[]>(
		() => [
			{
				id: "subscription-id",
				accessorKey: "subId",
				header: () => <TableHeadCustom>Subscription Id</TableHeadCustom>,
				cell: () => (
					<TableCellCustom className="font-semibold">{subscriptionId}</TableCellCustom>
				),
				meta: { className: "dashboard-sticky-column" },
				enableHiding: false,
				enableSorting: false,
			},
			{
				id: "transaction-id",
				accessorKey: "transactionId",
				header: () => <TableHeadCustom>Transaction Id</TableHeadCustom>,
				cell: ({ row }) => (
					<TableCellCustom>{row.original.v.transactionId || "N/A"}</TableCellCustom>
				),
				enableSorting: false,
			},
			{
				id: "queue-name",
				accessorKey: "QueueName",
				header: () => <TableHeadCustom>Queue</TableHeadCustom>,
				cell: ({ row }) => (
					<TableCellCustom>{row.original.v.QueueName || "N/A"}</TableCellCustom>
				),
				enableSorting: false,
			},
			{
				id: "created-at",
				accessorKey: "insertion_time",
				header: () => <TableHeadCustom>Created At</TableHeadCustom>,
				cell: ({ row }) => (
					<TableCellCustom>
						{formatUtcDateTime(row.original.v.insertion_time)}
					</TableCellCustom>
				),
				enableSorting: false,
			},
			{
				id: "crawl-status",
				accessorKey: "crawl_status",
				header: () => <TableHeadCustom>Crawl Status</TableHeadCustom>,
				cell: ({ row }) => {
					const status = row.original.v.crawl_status ?? "No Data";
					const tip = row.original.v.error || "No error";
					return (
						<TableCellCustom>
							<TableCellTooltip tip={tip}>
								<Badge
									className={cn(
										dashboardDataTag,
										status !== "SUCCESS" && dashboardDangerDataTag,
									)}
								>
									{status}
								</Badge>
							</TableCellTooltip>
						</TableCellCustom>
					);
				},
				sortingFn: sortStatus,
			},
			{
				id: "scheduler-id",
				accessorKey: "schedulerId",
				header: () => <TableHeadCustom>Scheduler Id</TableHeadCustom>,
				cell: ({ row }) => <TableCellCustom>{row.original.k}</TableCellCustom>,
				sortingFn: sortScheduler,
			},
			{
				id: "response-sent",
				accessorKey: "responseSent",
				header: () => <TableHeadCustom>Response Sent</TableHeadCustom>,
				cell: ({ row }) => (
					<HistoryResourceCell kind="response" onOpen={openResource} row={row.original} />
				),
				enableSorting: false,
			},
			{
				id: "crawled-output",
				accessorKey: "crawledOutput",
				header: () => <TableHeadCustom>Crawled Output</TableHeadCustom>,
				cell: ({ row }) => (
					<HistoryResourceCell kind="crawled" onOpen={openResource} row={row.original} />
				),
				enableSorting: false,
			},
		],
		[openResource, subscriptionId],
	);

	if (historyQuery.isPending) return <DashboardTableSkeleton />;

	if (historyQuery.isError || historyQuery.error) {
		return (
			<div className="mt-6 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">Error: {historyQuery.error?.message}</p>
			</div>
		);
	}

	if (historyQuery.data && !historyQuery.data.success) {
		return (
			<div className="mt-10 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">{String(historyQuery.data.data)}</p>
			</div>
		);
	}

	return (
		<>
			<TableDataStaticComponent
				tableType="history"
				data={historyQuery.data}
				columns={columns}
				preferenceKey={`history-${params.mode}`}
				defaultVisibleColumnIds={[
					"subscription-id",
					"created-at",
					"crawl-status",
					"queue-name",
					"transaction-id",
					"response-sent",
					"crawled-output",
				]}
			/>
			{selection ? (
				<HistoryDrawer
					{...selection}
					onOpenChange={(open) => {
						if (!open) setSelection(null);
					}}
					open
				/>
			) : null}
		</>
	);
}
