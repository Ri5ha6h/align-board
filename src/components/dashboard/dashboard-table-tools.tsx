"use client";

import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import { Columns3, Ellipsis } from "lucide-react";

import {
	dashboardDialog,
	dashboardEmptyState,
	dashboardSheet,
} from "@/components/dashboard/dashboard-styles";
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
			<DialogContent className={dashboardDialog} data-dashboard-surface>
				<DialogHeader>
					<DialogTitle>Visible columns</DialogTitle>
					<DialogDescription>
						Choose the operational fields shown in the desktop table.
					</DialogDescription>
				</DialogHeader>
				<div className="grid max-h-[55vh] grid-cols-1 gap-px overflow-y-auto border border-dashboard-line sm:grid-cols-2">
					{columns.map((column) => (
						<label
							className="flex cursor-pointer items-center gap-3 bg-dashboard-ink px-3 py-2.5 text-xs text-[#d4d4d8]"
							key={column.id}
						>
							<input
								checked={column.getIsVisible()}
								className="accent-dashboard-white"
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
		<div className="grid gap-2 min-[651px]:hidden">
			{rows.length ? (
				rows.map((row) => {
					const priorityCells = row
						.getVisibleCells()
						.filter((cell) => !["edit", "close", "delete"].includes(cell.column.id))
						.slice(0, 5);
					return (
						<article
							className="rounded-[2px] border border-dashboard-line bg-dashboard-ink p-3.5"
							key={row.id}
						>
							<div className="space-y-px">
								{priorityCells.map((cell) => (
									<div
										className="grid grid-cols-[minmax(90px,0.75fr)_minmax(0,1.25fr)] items-center gap-3 border-b border-[rgba(68,68,73,0.65)] py-2"
										key={cell.id}
									>
										<span className="font-dashboard-code text-[8px] tracking-[0.07em] text-dashboard-mist uppercase">
											{labelFromId(cell.column.id)}
										</span>
										<div className="min-w-0 overflow-hidden text-right font-dashboard-code text-[10px] text-dashboard-white">
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
									className={`${dashboardSheet} overflow-y-auto`}
									data-dashboard-surface
									side="right"
								>
									<SheetHeader>
										<SheetTitle>Row details</SheetTitle>
										<SheetDescription>
											All available fields for this result.
										</SheetDescription>
									</SheetHeader>
									<div className="divide-y divide-dashboard-line border border-dashboard-line">
										{row.getAllCells().map((cell) => (
											<div className="grid gap-2 p-3" key={cell.id}>
												<span className="font-dashboard-code text-[9px] tracking-[0.08em] text-dashboard-mist uppercase">
													{labelFromId(cell.column.id)}
												</span>
												<div className="min-w-0 text-sm text-dashboard-white">
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
				<div className={dashboardEmptyState}>No results.</div>
			)}
		</div>
	);
}
