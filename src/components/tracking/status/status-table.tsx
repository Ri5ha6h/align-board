"use client";
import type { ColumnDef, SortingFn } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import * as React from "react";

import { DashboardTableSkeleton } from "@/components/dashboard/dashboard-loading";
import { useDashboardQueryReport } from "@/components/dashboard/dashboard-runtime";
import { TableDataStaticComponent } from "@/components/data-table-static";
import { TableCellCustom, TableHeadCustom } from "@/components/table/table-component";
import { Button } from "@/components/ui/button";
import type { ParamType, StatusColumnType, StatusValue } from "@/utils/common-types";
import { formatUtcDate, formatUtcDateTime } from "@/utils/format-date";
import { useStatusQuery } from "@/utils/query";

import { StatusDetailDrawer } from "./status-detail-drawer";

const disabledActionClassName =
	"disabled:pointer-events-auto disabled:cursor-not-allowed disabled:border-[#444449] disabled:bg-[#2d2d31] disabled:text-[#71717a] disabled:opacity-100";

const sortCreated: SortingFn<StatusColumnType> = (rowA, rowB) =>
	Number(rowA.original.created_at) - Number(rowB.original.created_at);

export function StatusTable({ ...props }: { type: string; isAlignUser: boolean }) {
	const params = useParams<ParamType>();
	const [selectedStatus, setSelectedStatus] = React.useState<StatusValue | null>(null);

	const columns: ColumnDef<StatusColumnType>[] = [
		{
			id: params.mode === "terminal" ? "terminal" : "carrier",
			accessorKey: "carrier",
			header: () => (
				<TableHeadCustom>
					{params.mode === "terminal" ? "Terminal" : "Carrier"}
				</TableHeadCustom>
			),
			cell: ({ row }) => {
				const carrier = row.original.value.carrier;
				return <TableCellCustom>{carrier ? carrier : "-"}</TableCellCustom>;
			},
			meta: {
				className: "dashboard-sticky-column",
			},
			enableHiding: false,
			enableSorting: false,
		},
		{
			id: "status",
			accessorKey: "status",
			header: () => <TableHeadCustom>Status</TableHeadCustom>,
			cell: ({ row }) => {
				const status = row.original.value.status;
				return <TableCellCustom className="dashboard-data-tag">{status}</TableCellCustom>;
			},
			enableSorting: false,
		},
		{
			id: "issue",
			accessorKey: "issue",
			header: () => <TableHeadCustom>Issue</TableHeadCustom>,
			cell: ({ row }) => (
				<TableCellCustom className="font-semibold">
					<p className="w-32 truncate capitalize">{row.original.value.issue}</p>
				</TableCellCustom>
			),
			enableSorting: false,
		},
		{
			id: "impact",
			accessorKey: "impact",
			header: () => <TableHeadCustom>Impact</TableHeadCustom>,
			cell: ({ row }) => (
				<TableCellCustom className="font-semibold">
					<p className="w-46 truncate capitalize">{row.original.value.impact}</p>
				</TableCellCustom>
			),
			enableSorting: false,
		},
		{
			id: "status-type",
			accessorKey: "statusType",
			header: () => <TableHeadCustom>Type</TableHeadCustom>,
			cell: ({ row }) => {
				const type = row.original.value.statusType;
				return <TableCellCustom className="dashboard-data-tag">{type}</TableCellCustom>;
			},
			enableSorting: false,
		},
		{
			id: "eta",
			accessorKey: "eta",
			header: () => <TableHeadCustom>Expected Resolution Date</TableHeadCustom>,
			cell: ({ row }) => {
				return (
					<TableCellCustom>
						{formatUtcDate(row.original.value.expectedResolutionDate)}
					</TableCellCustom>
				);
			},
			enableSorting: false,
		},
		{
			id: "created-at",
			accessorKey: "createdAt",
			header: () => <TableHeadCustom>Created At</TableHeadCustom>,
			cell: ({ row }) => {
				return (
					<TableCellCustom>{formatUtcDateTime(row.original.created_at)}</TableCellCustom>
				);
			},
			sortingFn: sortCreated,
		},
		{
			id: "more-detail",
			accessorKey: "moreDetail",
			header: () => <TableHeadCustom>Details</TableHeadCustom>,
			cell: ({ row }) => {
				return (
					<Button
						className="dashboard-row-action"
						onClick={() => setSelectedStatus(row.original.value)}
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

	if (props.isAlignUser) {
		columns.push({
			id: "edit",
			accessorKey: "edit",
			header: () => <TableHeadCustom>Edit</TableHeadCustom>,
			cell: () => {
				return (
					<>
						{/* Status editing is temporarily disabled.
						<CreateEditStatusDrawer
							variant="outline"
							buttonTitle="Edit"
							title="Edit a status"
							state="EDIT"
							tableType={props.type.toUpperCase()}
							statusKey={row.original.statusKey}
							statusValue={row.original.value}
						/>
						*/}
						<Button
							type="button"
							variant="outline"
							disabled
							className={disabledActionClassName}
						>
							Edit
						</Button>
					</>
				);
			},
			enableSorting: false,
		});
		if (props.type !== "closed") {
			columns.push({
				id: "close",
				accessorKey: "close",
				header: () => <TableHeadCustom>Close</TableHeadCustom>,
				cell: () => {
					return (
						<>
							{/* Status closing is temporarily disabled.
							<CloseStatusForm
								statusKey={row.original.statusKey}
								carrier={row.original.value.carrier}
							/>
							*/}
							<Button
								type="button"
								variant="outline"
								disabled
								className={disabledActionClassName}
							>
								Close
							</Button>
						</>
					);
				},
				enableSorting: false,
			});
		}
		columns.push({
			id: "delete",
			accessorKey: "delete",
			header: () => <TableHeadCustom>Delete</TableHeadCustom>,
			cell: () => {
				return (
					<>
						{/* Status deletion is temporarily disabled.
						<DeleteStatusForm
							statusKey={row.original.statusKey}
							carrier={row.original.value.carrier}
							tableType={props.type.toUpperCase()}
						/>
						*/}
						<Button
							type="button"
							variant="outline"
							disabled
							className={disabledActionClassName}
						>
							Delete
						</Button>
					</>
				);
			},
			enableSorting: false,
		});
	}

	const statusQuery = useStatusQuery(props.type.toUpperCase(), params);
	useDashboardQueryReport({
		data: statusQuery.data,
		error: statusQuery.error,
		isFetching: statusQuery.isFetching,
		isPending: statusQuery.isPending,
		success: statusQuery.data?.success,
	});

	if (statusQuery.isPending) {
		return <DashboardTableSkeleton />;
	}

	if (statusQuery.isError || statusQuery.error) {
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<p className="text-red-500">Error: {statusQuery.error?.message}</p>
			</div>
		);
	}

	if (statusQuery.data && !statusQuery.data?.success) {
		return (
			<div>
				<div className="flex justify-center p-5">
					<Button
						onMouseDown={() => statusQuery.refetch()}
						disabled={statusQuery.isFetching}
					>
						{statusQuery.isFetching ? "Fetching..." : "Refresh"}
					</Button>
				</div>
				<div className="dashboard-empty-state">
					<p className="capitalize">{statusQuery.data?.data}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div>
				<div className="flex justify-end p-5">
					<Button
						onMouseDown={() => statusQuery.refetch()}
						disabled={statusQuery.isFetching}
					>
						{statusQuery.isFetching ? "Fetching..." : "Refresh"}
					</Button>
				</div>
				<TableDataStaticComponent
					data={statusQuery.data}
					columns={columns}
					preferenceKey={`status-${params.mode}-${props.type}`}
					defaultVisibleColumnIds={[
						params.mode === "terminal" ? "terminal" : "carrier",
						"status",
						"issue",
						"impact",
						"status-type",
						"eta",
						"more-detail",
						...(props.isAlignUser
							? ["edit", ...(props.type === "closed" ? [] : ["close"]), "delete"]
							: []),
					]}
				/>
				<StatusDetailDrawer
					data={selectedStatus}
					onOpenChange={(open) => {
						if (!open) {
							setSelectedStatus(null);
						}
					}}
					open={selectedStatus !== null}
				/>
			</div>
		</>
	);
}
