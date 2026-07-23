"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format, toDate } from "date-fns";
import { useParams, useSearchParams } from "next/navigation";
import * as React from "react";

import { DashboardTableSkeleton } from "@/components/dashboard/dashboard-loading";
import {
	DashboardWaitingState,
	useDashboardQueryReport,
} from "@/components/dashboard/dashboard-runtime";
import { TableDataStaticComponent } from "@/components/data-table-static";
import { TableCellCustom, TableHeadCustom } from "@/components/table/table-component";
import { Badge } from "@/components/ui/badge";
import type { ParamType, ReferenceTableType } from "@/utils/common-types";
import { useReferenceQuery } from "@/utils/query";

export function ReferenceTable() {
	const params = useParams<ParamType>();
	const searchParams = useSearchParams();

	if (!searchParams.get("refCarrier") && !searchParams.get("reference")) {
		return (
			<DashboardWaitingState>
				Select a carrier and enter a reference to view data.
			</DashboardWaitingState>
		);
	}

	return <ReferenceData params={params} searchParams={searchParams} />;
}

const ReferenceData = ({ ...props }) => {
	const referenceId = React.useMemo(
		() => `${props.searchParams.get("refCarrier")}_${props.searchParams.get("reference")}`,
		[props.searchParams],
	);

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
				className: "dashboard-sticky-column",
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
			cell: ({ row }) => {
				return <TableCellCustom>{row.original.carrier}</TableCellCustom>;
			},
			enableSorting: false,
		},
		{
			id: "ref-type",
			accessorKey: "refType",
			header: () => <TableHeadCustom>Reference Type</TableHeadCustom>,
			cell: ({ row }) => {
				const ref = row.original.referenceType;
				return (
					<TableCellCustom>
						<Badge className="dashboard-data-tag">{ref}</Badge>
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
			cell: ({ row }) => {
				return <TableCellCustom>{row.original.status}</TableCellCustom>;
			},
			enableSorting: false,
		},
		{
			id: "queue",
			accessorKey: "queueType",
			header: () => <TableHeadCustom>Queue</TableHeadCustom>,
			cell: ({ row }) => {
				const queue = row.original.queue;
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
			id: "created-at",
			accessorKey: "createdAt",
			header: () => <TableHeadCustom>Created On</TableHeadCustom>,
			cell: ({ row }) => {
				const time = row.original.createdAt;
				let showT = "";
				if (time !== null && time !== "" && time !== "null") {
					showT = format(toDate(time), "do MMM yyyy, HH:mm:ss");
				}
				return <TableCellCustom>{showT}</TableCellCustom>;
			},
			enableSorting: true,
			sortDescFirst: true,
			sortUndefined: "last",
		},
		{
			id: "last-crawled-at",
			accessorKey: "lastCrawledAt",
			header: () => <TableHeadCustom>Last Crawled At</TableHeadCustom>,
			cell: ({ row }) => {
				const time = row.original.lastCrawledAt;
				let showT = "";
				if (time !== null && time !== "" && time !== "null") {
					showT = format(toDate(time), "do MMM yyyy, HH:mm:ss");
				}
				return <TableCellCustom>{showT}</TableCellCustom>;
			},
			enableSorting: true,
			sortDescFirst: true,
			sortUndefined: "last",
		},
		{
			id: "updated-at",
			accessorKey: "updatedAt",
			header: () => <TableHeadCustom>Updated At</TableHeadCustom>,
			cell: ({ row }) => {
				const time = row.original.updatedAt;
				let showT = "";
				if (time !== null && time !== "" && time !== "null") {
					showT = format(toDate(time), "do MMM yyyy, HH:mm:ss");
				}
				return <TableCellCustom>{showT}</TableCellCustom>;
			},
			enableSorting: true,
			sortDescFirst: true,
			sortUndefined: "last",
		},
	];

	const referenceQuery = useReferenceQuery(
		props.params,
		props.searchParams.get("category"),
		referenceId,
	);
	useDashboardQueryReport({
		data: referenceQuery.data,
		error: referenceQuery.error,
		isFetching: referenceQuery.isFetching,
		isPending: referenceQuery.isPending,
		success: referenceQuery.data?.success,
	});

	if (referenceQuery.isPending) {
		return <DashboardTableSkeleton />;
	}

	if (referenceQuery.isError || referenceQuery.error) {
		return (
			<div className="mt-6 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">Error: {referenceQuery.error?.message}</p>
			</div>
		);
	}

	if (referenceQuery.data && !referenceQuery.data?.success) {
		return (
			<div className="mt-10 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">{referenceQuery.data?.data}</p>
			</div>
		);
	}

	return (
		<TableDataStaticComponent
			data={referenceQuery.data}
			columns={columns}
			preferenceKey={`references-reference-${props.params.mode}`}
			defaultVisibleColumnIds={[
				"subscription-id",
				props.params.mode === "terminal" ? "terminal" : "carrier",
				"ref-type",
				"ref-num",
				"status",
				"last-crawled-at",
			]}
		/>
	);
};
