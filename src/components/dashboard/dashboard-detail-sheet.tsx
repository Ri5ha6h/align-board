"use client";

import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

import { DashboardSkeleton } from "@/components/dashboard/dashboard-loading";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DashboardDetailField {
	label: string;
	value: unknown;
}

interface DashboardDetailBodyProps {
	error?: string;
	fields?: DashboardDetailField[];
	isLoading?: boolean;
	isRefreshing?: boolean;
	onRetry?: () => void;
	rawValue?: unknown;
}

function displayValue(value: unknown) {
	if (value === null || value === undefined || value === "") {
		return "—";
	}
	if (typeof value === "object") {
		return JSON.stringify(value);
	}
	return String(value);
}

export function DashboardDetailBody({
	error,
	fields = [],
	isLoading = false,
	isRefreshing = false,
	onRetry,
	rawValue,
}: DashboardDetailBodyProps) {
	if (isLoading) {
		return (
			<div aria-label="Loading details" aria-live="polite" className="space-y-px py-5">
				{Array.from({ length: 7 }, (_, index) => (
					<DashboardSkeleton className="h-12 w-full" key={index} />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="dashboard-detail-error" role="alert">
				<AlertTriangle aria-hidden="true" />
				<div>
					<strong>Details unavailable</strong>
					<p>{error} Try opening this result again.</p>
					{onRetry ? (
						<Button onClick={onRetry} size="sm" type="button" variant="outline">
							<RefreshCw aria-hidden="true" />
							Retry
						</Button>
					) : null}
				</div>
			</div>
		);
	}

	return (
		<ScrollArea className="dashboard-detail-scroll">
			{isRefreshing ? (
				<div aria-live="polite" className="dashboard-detail-updating">
					<Loader2 aria-hidden="true" />
					Updating details…
				</div>
			) : null}
			<div className="dashboard-detail-grid">
				{fields.map((field) => (
					<div className="dashboard-detail-field" key={field.label}>
						<span>{field.label}</span>
						<strong>{displayValue(field.value)}</strong>
					</div>
				))}
			</div>
			<Accordion collapsible className="dashboard-raw-payload" type="single">
				<AccordionItem value="payload">
					<AccordionTrigger>Raw Payload</AccordionTrigger>
					<AccordionContent>
						<pre>{JSON.stringify(rawValue ?? {}, null, 2)}</pre>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</ScrollArea>
	);
}
