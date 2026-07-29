"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useParams, useSearchParams } from "next/navigation";
import * as React from "react";

import { DashboardTableSkeleton } from "@/components/dashboard/dashboard-loading";
import {
	DashboardWaitingState,
	useDashboardQueryReport,
} from "@/components/dashboard/dashboard-runtime";
import { dashboardDataTag, dashboardRowAction } from "@/components/dashboard/dashboard-styles";
import { TableDataStaticComponent } from "@/components/data-table-static";
import { TableCellCustom, TableHeadCustom } from "@/components/table/table-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ParamType, ReferenceTableType } from "@/utils/common-types";
import { formatUtcDateTime } from "@/utils/format-date";
import { useReferenceAllQuery } from "@/utils/query";

import { ReferenceDrawer } from "./reference-all-drawer";

export function ReferenceAllTable() {
	const params = useParams<ParamType>();
	const searchParams = useSearchParams();

	if (!searchParams.get("carrier")) {
		return <DashboardWaitingState>Select a carrier to view references.</DashboardWaitingState>;
	}

	return <ReferenceAllData params={params} searchParams={searchParams} />;
}

const ReferenceAllData = ({ ...props }) => {
	const [selectedReference, setSelectedReference] = React.useState<string | null>(null);
	const columns: ColumnDef<ReferenceTableType>[] = [
		{
			id: "subscription-id",
			accessorKey: "subscriptionId",
			header: () => <TableHeadCustom>Subscription Id</TableHeadCustom>,
			cell: ({ row }) => (
				<TableCellCustom className="font-semibold">
					{row.original.subscriptionId}
				</TableCellCustom>
			),
			meta: {
				sticky: true,
			},
			enableHiding: false,
			enableSorting: false,
		},
		{
			id: props.params.mode === "terminal" ? "terminal" : "carrier",
			accessorKey: "carrier",
			header: () => (
				<TableHeadCustom>
					{props.params.mode === "terminal" ? "Terminal" : "Carrier"}
				</TableHeadCustom>
			),
			cell: () => {
				return <TableCellCustom>{props.searchParams.get("carrier")}</TableCellCustom>;
			},
			enableSorting: false,
		},
		{
			id: "ref-type",
			accessorKey: "refType",
			header: () => <TableHeadCustom>Reference Type</TableHeadCustom>,
			cell: ({ row }) => {
				let ref = row.original.subscriptionId;
				ref = ref.includes("BOOKING")
					? "Booking"
					: ref.includes("BILL")
						? "BillOfLading"
						: ref.includes("CONTAINER")
							? "Container"
							: ref.includes("AWB")
								? "AWB"
								: ref.includes("EXPORT")
									? "EXPORT"
									: ref.includes("LTL")
										? "LTL"
										: ref.includes("HAWB")
											? "HAWB"
											: ref.includes("LOAD")
												? "LOAD"
												: ref.includes("INTMD")
													? "INTMD"
													: ref.includes("FTL")
														? "FTL"
														: "IMPORT";

				return (
					<TableCellCustom>
						<Badge className={dashboardDataTag}>{ref}</Badge>
					</TableCellCustom>
				);
			},
			enableSorting: false,
		},
		{
			id: "ref-num",
			accessorKey: "refNum",
			header: () => <TableHeadCustom>Reference Number</TableHeadCustom>,
			cell: ({ row }) => {
				return <TableCellCustom>{row.original.referenceNumber}</TableCellCustom>;
			},
			enableSorting: false,
		},
		{
			id: "status",
			accessorKey: "status",
			header: () => <TableHeadCustom>Status</TableHeadCustom>,
			cell: () => {
				const status = props.searchParams.get("refStatus") ?? "ACTIVE";

				return <TableCellCustom className={dashboardDataTag}>{status}</TableCellCustom>;
			},
			enableSorting: false,
		},
		{
			id: "queue",
			accessorKey: "queueType",
			header: () => <TableHeadCustom>Queue</TableHeadCustom>,
			cell: () => {
				const queue = props.searchParams.get("queue") ?? "";
				const qType = queue.includes("NORMAL")
					? "Normal"
					: queue.includes("ADAPTIVE")
						? "Adaptive"
						: queue.includes("RNF")
							? "RNF"
							: "";

				return <TableCellCustom>{qType}</TableCellCustom>;
			},
			enableSorting: false,
		},
		{
			id: "last-crawled-at",
			accessorKey: "lastCrawledAt",
			header: () => <TableHeadCustom>Last Crawled At</TableHeadCustom>,
			cell: ({ row }) => {
				const time = row.original.lastCrawledAt;
				let showT = "";
				if (time !== null && time !== "" && time !== "null") {
					showT = formatUtcDateTime(time);
				}
				return <TableCellCustom>{showT}</TableCellCustom>;
			},
			enableSorting: true,
			sortDescFirst: true,
			sortUndefined: "last",
		},
		{
			id: "more-info",
			accessorKey: "moreInfo",
			header: () => <TableHeadCustom>More Info</TableHeadCustom>,
			cell: ({ row }) => {
				return (
					<Button
						className={dashboardRowAction}
						onClick={() => setSelectedReference(row.original.subscriptionId)}
						type="button"
						variant="outline"
					>
						View Details
					</Button>
				);
			},
			enableSorting: false,
		},
	];

	if (props.searchParams.get("refStatus") === "CLOSED") {
		columns.splice(5, 2);
	}

	const referenceAllQuery = useReferenceAllQuery(props.params, props.searchParams);
	useDashboardQueryReport({
		data: referenceAllQuery.data,
		error: referenceAllQuery.error,
		isFetching: referenceAllQuery.isFetching,
		isPending: referenceAllQuery.isPending,
		success: referenceAllQuery.data?.success,
	});

	if (referenceAllQuery.isPending) {
		return <DashboardTableSkeleton />;
	}

	if (referenceAllQuery.isError || referenceAllQuery.error) {
		return (
			<div className="mt-6 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">Error: {referenceAllQuery.error?.message}</p>
			</div>
		);
	}

	if (referenceAllQuery.data && !referenceAllQuery.data?.success) {
		return (
			<div className="mt-10 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">{referenceAllQuery.data?.data}</p>
			</div>
		);
	}

	return (
		<>
			<TableDataStaticComponent
				data={referenceAllQuery.data}
				columns={columns}
				preferenceKey={`references-all-${props.params.mode}`}
				defaultVisibleColumnIds={[
					"subscription-id",
					props.params.mode === "terminal" ? "terminal" : "carrier",
					"ref-type",
					"ref-num",
					"status",
					"last-crawled-at",
					"more-info",
				]}
			/>
			{selectedReference ? (
				<ReferenceDrawer
					onOpenChange={(open) => {
						if (!open) setSelectedReference(null);
					}}
					open
					params={props.params}
					resource={selectedReference}
					searchParams={props.searchParams}
					title="Reference Information"
				/>
			) : null}
		</>
	);
};
