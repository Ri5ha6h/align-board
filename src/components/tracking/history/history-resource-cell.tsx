"use client";

import { TableCellCustom, TableCellTooltipScroll } from "@/components/table/table-component";
import { Button } from "@/components/ui/button";
import type { HistoryType } from "@/utils/common-types";

export interface HistoryResourceSelection {
	buttonTitle: string;
	resourceId: string;
	schedulerId: string;
	title: string;
}

interface HistoryResourceCellProps {
	kind: "response" | "crawled";
	onOpen: (selection: HistoryResourceSelection) => void;
	row: HistoryType;
}

function resourceButton(
	selection: HistoryResourceSelection,
	onOpen: HistoryResourceCellProps["onOpen"],
) {
	return (
		<Button
			className="dashboard-row-action"
			onClick={() => onOpen(selection)}
			type="button"
			variant="outline"
		>
			{selection.buttonTitle}
		</Button>
	);
}

function errorCell(row: HistoryType) {
	const error = row.v.error;
	const message =
		typeof row.v.errorMsg === "object" && row.v.errorMsg && "error" in row.v.errorMsg
			? String(row.v.errorMsg.error)
			: String(row.v.errorMsg);
	return (
		<TableCellCustom>
			<TableCellTooltipScroll tip={message}>{error}</TableCellTooltipScroll>
		</TableCellCustom>
	);
}

export function HistoryResourceCell({ kind, onOpen, row }: HistoryResourceCellProps) {
	const response = row.v.fkMappedJsonResourceId || "No data";
	const latestResponse = row.v.latestFKMappedJsonResourceId || "No data";
	const crawledResponse = row.v.crawledJsonResourceId || "No data";
	const hasResponse = response !== "No data" && response !== "null";
	const hasLatestResponse = latestResponse !== "No data" && latestResponse !== "null";
	const hasCrawledResponse = crawledResponse !== "No data" && crawledResponse !== "null";
	const samePayload = response === "SAME_PAYLOAD";

	if (kind === "response") {
		if (row.v.error && !hasResponse && !hasLatestResponse) return errorCell(row);
		if (samePayload && hasLatestResponse) {
			return resourceButton(
				{
					buttonTitle: "Same",
					resourceId: latestResponse,
					schedulerId: row.k,
					title: "Response Sent",
				},
				onOpen,
			);
		}
		if (hasResponse && !samePayload) {
			return resourceButton(
				{
					buttonTitle: "New Events",
					resourceId: response,
					schedulerId: row.k,
					title: "Response Sent",
				},
				onOpen,
			);
		}
		if (samePayload && !hasLatestResponse) {
			return <TableCellCustom>Same Payload</TableCellCustom>;
		}
		return <TableCellCustom>{hasResponse ? "Unhandled" : "Payload"}</TableCellCustom>;
	}

	if (row.v.error && !hasResponse) return errorCell(row);
	if (hasCrawledResponse && samePayload) {
		return resourceButton(
			{
				buttonTitle: "Same",
				resourceId: crawledResponse,
				schedulerId: row.k,
				title: "Crawled Output",
			},
			onOpen,
		);
	}
	if (hasCrawledResponse) {
		return resourceButton(
			{
				buttonTitle: hasResponse ? "New Events" : "Crawled JSON",
				resourceId: crawledResponse,
				schedulerId: row.k,
				title: "Crawled Output",
			},
			onOpen,
		);
	}
	return <TableCellCustom>Unhandled</TableCellCustom>;
}
