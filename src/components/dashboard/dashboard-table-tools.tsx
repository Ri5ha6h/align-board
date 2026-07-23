"use client";

import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import { Columns3, Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

function labelFromId(id: string) {
	return id.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function DashboardColumnControls<TData>({ table }: { table: TanStackTable<TData> }) {
	const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());
	if (!columns.length) return null;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" variant="outline">
					<Columns3 />
					Columns
				</Button>
			</DialogTrigger>
			<DialogContent className="dashboard-dialog">
				<DialogHeader>
					<DialogTitle>Visible columns</DialogTitle>
					<DialogDescription>
						Choose the operational fields shown in the desktop table.
					</DialogDescription>
				</DialogHeader>
				<div className="grid max-h-[55vh] grid-cols-1 gap-px overflow-y-auto border border-[#444449] sm:grid-cols-2">
					{columns.map((column) => (
						<label
							className="flex cursor-pointer items-center gap-3 bg-[#2d2d31] px-3 py-2.5 text-xs text-[#d4d4d8]"
							key={column.id}
						>
							<input
								checked={column.getIsVisible()}
								className="accent-[#fafafa]"
								onChange={column.getToggleVisibilityHandler()}
								type="checkbox"
							/>
							{labelFromId(column.id)}
						</label>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function DashboardMobileCards<TData>({ table }: { table: TanStackTable<TData> }) {
	const rows = table.getRowModel().rows;
	return (
		<div className="dashboard-mobile-cards gap-2">
			{rows.length ? (
				rows.map((row) => {
					const priorityCells = row
						.getVisibleCells()
						.filter((cell) => !["edit", "close", "delete"].includes(cell.column.id))
						.slice(0, 5);
					return (
						<article className="dashboard-mobile-card" key={row.id}>
							<div className="space-y-px">
								{priorityCells.map((cell) => (
									<div className="dashboard-mobile-field" key={cell.id}>
										<span>{labelFromId(cell.column.id)}</span>
										<div>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</div>
									</div>
								))}
							</div>
							<Sheet>
								<SheetTrigger asChild>
									<Button className="mt-3 w-full" size="sm" variant="outline">
										<Ellipsis />
										Details
									</Button>
								</SheetTrigger>
								<SheetContent
									className="dashboard-sheet overflow-y-auto"
									side="right"
								>
									<SheetHeader>
										<SheetTitle>Row details</SheetTitle>
										<SheetDescription>
											All available fields for this result.
										</SheetDescription>
									</SheetHeader>
									<div className="divide-y divide-[#444449] border border-[#444449]">
										{row.getAllCells().map((cell) => (
											<div className="grid gap-2 p-3" key={cell.id}>
												<span className="font-mono text-[9px] tracking-[0.08em] text-[#a1a1aa] uppercase">
													{labelFromId(cell.column.id)}
												</span>
												<div className="min-w-0 text-sm text-[#fafafa]">
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</div>
											</div>
										))}
									</div>
								</SheetContent>
							</Sheet>
						</article>
					);
				})
			) : (
				<div className="dashboard-empty-state">No results.</div>
			)}
		</div>
	);
}

export function getInitialColumnVisibility(
	columns: Array<{ accessorKey?: unknown; id?: string }>,
	defaultVisibleColumnIds?: string[],
) {
	if (!defaultVisibleColumnIds?.length) return {};
	const visible = new Set(defaultVisibleColumnIds);
	return Object.fromEntries(
		columns
			.map((column) =>
				column.id || typeof column.accessorKey !== "string"
					? column.id
					: column.accessorKey,
			)
			.filter((id): id is string => Boolean(id))
			.map((id) => [id, visible.has(id)]),
	);
}
