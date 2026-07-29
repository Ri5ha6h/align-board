"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type RowData,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";

import {
	dashboardSelectContent,
	dashboardStickyColumn,
} from "@/components/dashboard/dashboard-styles";
import {
	DashboardColumnControls,
	DashboardMobileCards,
} from "@/components/dashboard/dashboard-table-tools";
import { getInitialColumnVisibility } from "@/components/dashboard/dashboard-table-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		className?: string;
		sticky?: boolean;
	}
}

interface TablePreferences {
	columnVisibility: VisibilityState;
	pageSize: number;
	version: 1;
}

interface PreferenceSnapshot {
	preferences: TablePreferences | null;
	ready: boolean;
}

interface DashboardDataTableProps<TData> {
	columns: ColumnDef<TData, unknown>[];
	data: { data?: TData[] };
	defaultVisibleColumnIds?: string[];
	preferenceKey: string;
	tableType?: "history";
}

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [10, 25, 50] as const;
const STORAGE_PREFIX = "alignbits.dashboard-table.v1";
const SERVER_PREFERENCE_SNAPSHOT: PreferenceSnapshot = {
	preferences: null,
	ready: false,
};
const preferenceSnapshots = new Map<string, PreferenceSnapshot>();

function readPreferenceSnapshot(key: string): PreferenceSnapshot {
	const cached = preferenceSnapshots.get(key);
	if (cached) {
		return cached;
	}
	let preferences: TablePreferences | null = null;
	try {
		const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
		if (parsed && typeof parsed === "object") {
			const value = parsed as Partial<TablePreferences>;
			if (
				value.version === 1 &&
				PAGE_SIZES.includes(value.pageSize as (typeof PAGE_SIZES)[number]) &&
				value.columnVisibility
			) {
				preferences = value as TablePreferences;
			}
		}
	} catch {
		// Defaults remain available when storage cannot be read.
	}
	const snapshot = { preferences, ready: true };
	preferenceSnapshots.set(key, snapshot);
	return snapshot;
}

const subscribeToPreferences = () => () => undefined;

function DashboardDataTable<TData>({
	columns,
	data: response,
	defaultVisibleColumnIds,
	preferenceKey,
	tableType,
}: DashboardDataTableProps<TData>) {
	const storageKey = `${STORAGE_PREFIX}.${preferenceKey}`;
	const defaultVisibility = React.useMemo(
		() => getInitialColumnVisibility(columns, defaultVisibleColumnIds),
		[columns, defaultVisibleColumnIds],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const preferenceSnapshot = React.useSyncExternalStore(
		subscribeToPreferences,
		() => readPreferenceSnapshot(storageKey),
		() => SERVER_PREFERENCE_SNAPSHOT,
	);
	const [columnVisibilityOverride, setColumnVisibilityOverride] =
		React.useState<VisibilityState | null>(null);
	const columnVisibility = React.useMemo(() => {
		const visibility = columnVisibilityOverride ?? {
			...defaultVisibility,
			...preferenceSnapshot.preferences?.columnVisibility,
		};
		for (const column of columns) {
			if (column.meta?.sticky) {
				const id =
					column.id ??
					("accessorKey" in column && typeof column.accessorKey === "string"
						? column.accessorKey
						: undefined);
				if (id) {
					visibility[id] = true;
				}
			}
		}
		return visibility;
	}, [columnVisibilityOverride, columns, defaultVisibility, preferenceSnapshot.preferences]);
	const [paginationOverride, setPaginationOverride] = React.useState<Partial<PaginationState>>({
		pageIndex: 0,
	});
	const basePagination = React.useMemo<PaginationState>(
		() => ({
			pageIndex: paginationOverride.pageIndex ?? 0,
			pageSize:
				paginationOverride.pageSize ??
				preferenceSnapshot.preferences?.pageSize ??
				DEFAULT_PAGE_SIZE,
		}),
		[paginationOverride, preferenceSnapshot.preferences?.pageSize],
	);
	const [historyFilter, setHistoryFilter] = React.useState("");

	const sourceData = React.useMemo(
		() => (Array.isArray(response.data) ? response.data : []),
		[response.data],
	);
	const data = React.useMemo(() => {
		if (tableType !== "history" || !historyFilter.trim()) {
			return sourceData;
		}
		const value = historyFilter.trim().toLowerCase();
		return sourceData.filter((item) => {
			const key =
				item && typeof item === "object" && "k" in item
					? String((item as { k: unknown }).k)
					: "";
			return key.toLowerCase().includes(value);
		});
	}, [historyFilter, sourceData, tableType]);
	const pagination = React.useMemo<PaginationState>(() => {
		const lastPageIndex = Math.max(Math.ceil(data.length / basePagination.pageSize) - 1, 0);
		return {
			...basePagination,
			pageIndex: Math.min(basePagination.pageIndex, lastPageIndex),
		};
	}, [basePagination, data.length]);

	React.useEffect(() => {
		if (!preferenceSnapshot.ready) {
			return;
		}
		try {
			const preferences: TablePreferences = {
				columnVisibility,
				pageSize: pagination.pageSize,
				version: 1,
			};
			localStorage.setItem(storageKey, JSON.stringify(preferences));
			preferenceSnapshots.set(storageKey, { preferences, ready: true });
		} catch {
			// The table remains usable when storage is unavailable.
		}
	}, [columnVisibility, pagination.pageSize, preferenceSnapshot.ready, storageKey]);

	const handleColumnVisibilityChange = React.useCallback(
		(updater: VisibilityState | ((current: VisibilityState) => VisibilityState)) => {
			setColumnVisibilityOverride((current) => {
				const value = current ?? columnVisibility;
				return typeof updater === "function" ? updater(value) : updater;
			});
		},
		[columnVisibility],
	);

	const handlePaginationChange = React.useCallback(
		(updater: PaginationState | ((current: PaginationState) => PaginationState)) => {
			setPaginationOverride((current) => {
				const value = {
					pageIndex: current.pageIndex ?? pagination.pageIndex,
					pageSize: current.pageSize ?? pagination.pageSize,
				};
				return typeof updater === "function" ? updater(value) : updater;
			});
		},
		[pagination],
	);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: handleColumnVisibilityChange,
		onPaginationChange: handlePaginationChange,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			pagination,
		},
	});

	const pageCount = Math.max(table.getPageCount(), 1);
	const pageIndex = Math.min(table.getState().pagination.pageIndex, pageCount - 1);
	const rangeStart = data.length ? pageIndex * pagination.pageSize + 1 : 0;
	const rangeEnd = Math.min((pageIndex + 1) * pagination.pageSize, data.length);

	return (
		<div className="mt-6 w-full">
			<div className="mb-2.5 flex min-h-[42px] items-center justify-between gap-3 [&>button]:rounded-[2px] [&>button]:border-dashboard-line [&>button]:bg-transparent [&>button]:font-dashboard-code [&>button]:text-[9px] [&>button]:tracking-[0.05em] [&>button]:text-dashboard-white [&>button]:uppercase [&>button:hover]:bg-dashboard-panel [&>button:hover]:text-dashboard-night">
				{tableType === "history" ? (
					<Input
						aria-label="Filter by scheduler ID"
						autoComplete="off"
						className="max-w-sm"
						name="scheduler-filter"
						onChange={(event) => setHistoryFilter(event.target.value)}
						placeholder="Filter scheduler ID…"
						spellCheck={false}
						value={historyFilter}
					/>
				) : (
					<span />
				)}
				<DashboardColumnControls table={table} />
			</div>
			<div className="overflow-x-auto rounded-[2px] border border-dashboard-line max-[651px]:hidden">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										className={cn(
											header.column.columnDef.meta?.className,
											header.column.columnDef.meta?.sticky &&
												dashboardStickyColumn,
											header.column.columnDef.meta?.sticky &&
												"z-14 bg-dashboard-ink",
										)}
										key={header.id}
									>
										{header.isPlaceholder ? null : header.column.getCanSort() ? (
											<button
												className={cn(
													"dashboard-sort-button flex min-h-[38px] w-full items-center justify-center gap-1.5 text-inherit [&_svg]:w-[11px]",
													"focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-dashboard-white",
												)}
												onClick={header.column.getToggleSortingHandler()}
												type="button"
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{header.column.getIsSorted() === "asc" ? (
													<ArrowUp aria-hidden="true" />
												) : header.column.getIsSorted() === "desc" ? (
													<ArrowDown aria-hidden="true" />
												) : (
													<ArrowUpDown aria-hidden="true" />
												)}
											</button>
										) : (
											flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											className={cn(
												cell.column.columnDef.meta?.className,
												cell.column.columnDef.meta?.sticky &&
													dashboardStickyColumn,
											)}
											key={cell.id}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell className="h-24 text-center" colSpan={columns.length}>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DashboardMobileCards table={table} />
			<div
				className="flex items-center justify-between gap-4 pt-3.5 font-dashboard-code text-[10px] tracking-[0.03em] text-dashboard-mist [font-variant-numeric:tabular-nums] max-[651px]:flex-col max-[651px]:items-start"
				aria-label="Table pagination"
			>
				<p>
					{rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{" "}
					{data.length.toLocaleString()}
				</p>
				<div className="flex items-center gap-2 max-[651px]:w-full max-[651px]:flex-wrap [&_[data-slot=select-trigger]]:rounded-[2px] [&_[data-slot=select-trigger]]:border-dashboard-line [&_[data-slot=select-trigger]]:bg-transparent [&_[data-slot=select-trigger]]:font-dashboard-code [&_[data-slot=select-trigger]]:text-[9px] [&_[data-slot=select-trigger]]:tracking-[0.05em] [&_[data-slot=select-trigger]]:text-dashboard-white [&_[data-slot=select-trigger]]:uppercase [&_button]:rounded-[2px] [&_button]:border-dashboard-line [&_button]:bg-transparent [&_button]:font-dashboard-code [&_button]:text-[9px] [&_button]:tracking-[0.05em] [&_button]:text-dashboard-white [&_button]:uppercase max-[651px]:[&_button]:flex-1 [&_button:disabled]:border-[rgba(68,68,73,0.65)] [&_button:disabled]:bg-transparent [&_button:disabled]:text-[#71717a] [&_button:disabled]:opacity-100 [&_button:hover:not(:disabled)]:bg-dashboard-panel [&_button:hover:not(:disabled)]:text-dashboard-night">
					<Select
						onValueChange={(value) => table.setPageSize(Number(value))}
						value={String(pagination.pageSize)}
					>
						<SelectTrigger aria-label="Rows per page" className="w-[84px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className={dashboardSelectContent}>
							{PAGE_SIZES.map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size} rows
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						size="sm"
						variant="outline"
					>
						Previous
					</Button>
					<span>
						{pageIndex + 1} / {pageCount}
					</span>
					<Button
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						size="sm"
						variant="outline"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}

export function TableDataStaticComponent<TData>(props: DashboardDataTableProps<TData>) {
	return <DashboardDataTable {...props} />;
}
