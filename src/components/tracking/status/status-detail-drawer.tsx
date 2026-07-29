import Link from "next/link";
import * as React from "react";

import {
	dashboardDetailHeader,
	dashboardDetailSheet,
	dashboardSheet,
} from "@/components/dashboard/dashboard-styles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { StatusValue } from "@/utils/common-types";

interface StatusDetailDrawerProps {
	data: StatusValue | null;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function StatusDetailDrawer({ data, onOpenChange, open }: StatusDetailDrawerProps) {
	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent
				className={`${dashboardSheet} ${dashboardDetailSheet}`}
				data-dashboard-surface
				side="right"
			>
				<SheetHeader className={dashboardDetailHeader}>
					<SheetTitle>Status Details</SheetTitle>
					<SheetDescription>
						Service notice, operational impact, and resolution information.
					</SheetDescription>
				</SheetHeader>
				{data ? <StatusDetailContent data={data} /> : null}
			</SheetContent>
		</Sheet>
	);
}

function StatusDetailContent({ data }: { data: StatusValue }) {
	const jiraLinks = React.useMemo(
		() =>
			Array.from(
				new Set(
					(data.jiraLink ?? "")
						.split(",")
						.map((link) => link.trim())
						.filter(Boolean),
				),
			),
		[data.jiraLink],
	);

	return (
		<ScrollArea className="min-h-0 flex-1 pt-[18px]">
			<div className="grid gap-4 px-px pt-px pb-[22px]">
				{data.carrier ? <StatusInput label="Carrier" value={data.carrier} /> : null}
				<StatusInput label="Status" value={data.status} />
				<StatusInput label="Status Type" value={data.statusType} />
				<StatusTextArea label="Issue" value={data.issue} />
				<StatusTextArea label="Impact" value={data.impact} />
				<StatusInput label="Expected Resolution Date" value={data.expectedResolutionDate} />
				<StatusInput label="Resolution" value={data.resolution} />
				{data.closedAt ? <StatusInput label="Closed At" value={data.closedAt} /> : null}
				{jiraLinks.length > 0 ? <StatusLinks links={jiraLinks} /> : null}
			</div>
		</ScrollArea>
	);
}

function StatusInput({ label, value }: { label: string; value: string | number }) {
	const id = React.useId();
	return (
		<div className="grid gap-[7px]">
			<Label
				className="font-dashboard-code text-[9px] font-medium tracking-[0.08em] text-dashboard-mist uppercase"
				htmlFor={id}
			>
				{label}
			</Label>
			<Input
				className="h-10 rounded-[2px] border-dashboard-line bg-dashboard-ink font-dashboard-code text-[11px] leading-[1.55] text-dashboard-white focus-visible:border-dashboard-white focus-visible:ring-1 focus-visible:ring-dashboard-white"
				id={id}
				value={value}
				readOnly
			/>
		</div>
	);
}

function StatusTextArea({ label, value }: { label: string; value: string | number }) {
	const id = React.useId();
	return (
		<div className="grid gap-[7px]">
			<Label
				className="font-dashboard-code text-[9px] font-medium tracking-[0.08em] text-dashboard-mist uppercase"
				htmlFor={id}
			>
				{label}
			</Label>
			<Textarea
				className="min-h-[132px] resize-y rounded-[2px] border-dashboard-line bg-dashboard-ink font-dashboard-code text-[11px] leading-[1.55] text-dashboard-white focus-visible:border-dashboard-white focus-visible:ring-1 focus-visible:ring-dashboard-white"
				id={id}
				value={value}
				readOnly
			/>
		</div>
	);
}

function StatusLinks({ links }: { links: string[] }) {
	return (
		<div className="grid gap-[7px]">
			<Label className="font-dashboard-code text-[9px] font-medium tracking-[0.08em] text-dashboard-mist uppercase">
				Jira Links
			</Label>
			<ul className="grid gap-px border border-dashboard-line bg-dashboard-line">
				{links.map((link, index) => (
					<li
						className="grid grid-cols-[auto_minmax(0,1fr)] gap-[9px] bg-dashboard-ink px-3 py-[11px] font-dashboard-code text-[10px] text-dashboard-mist"
						key={link}
					>
						<span>{index + 1}.</span>
						<Link
							className="[overflow-wrap:anywhere] text-dashboard-white underline underline-offset-3 hover:text-dashboard-mist focus-visible:rounded-[1px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-dashboard-white"
							href={link}
							rel="noopener noreferrer"
							target="_blank"
						>
							{link}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
