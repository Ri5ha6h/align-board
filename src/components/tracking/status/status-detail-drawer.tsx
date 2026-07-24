import Link from "next/link";
import * as React from "react";

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
			<SheetContent className="dashboard-sheet dashboard-detail-sheet" side="right">
				<SheetHeader className="dashboard-detail-header">
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
		<ScrollArea className="dashboard-detail-scroll dashboard-status-detail-scroll">
			<div className="dashboard-status-detail-fields">
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
		<div className="dashboard-status-detail-field">
			<Label htmlFor={id}>{label}</Label>
			<Input id={id} value={value} readOnly />
		</div>
	);
}

function StatusTextArea({ label, value }: { label: string; value: string | number }) {
	const id = React.useId();
	return (
		<div className="dashboard-status-detail-field">
			<Label htmlFor={id}>{label}</Label>
			<Textarea id={id} value={value} readOnly />
		</div>
	);
}

function StatusLinks({ links }: { links: string[] }) {
	return (
		<div className="dashboard-status-detail-field">
			<Label>Jira Links</Label>
			<ul className="dashboard-status-detail-links">
				{links.map((link, index) => (
					<li key={link}>
						<span>{index + 1}.</span>
						<Link href={link} rel="noopener noreferrer" target="_blank">
							{link}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
