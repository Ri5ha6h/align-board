"use client";

import { AlertTriangle } from "lucide-react";

import { DashboardSkeleton } from "@/components/dashboard/dashboard-loading";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DashboardDetailField {
	label: string;
	value: unknown;
}

interface DashboardDetailBodyProps {
	error?: string;
	fields?: DashboardDetailField[];
	isLoading?: boolean;
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

export function findDetailValue(value: unknown, candidateKeys: string[]): unknown {
	const candidates = new Set(
		candidateKeys.map((key) => key.toLowerCase().replaceAll(/[^a-z0-9]/g, "")),
	);
	const queue: unknown[] = [value];
	const visited = new Set<object>();

	while (queue.length) {
		const current = queue.shift();
		if (!current || typeof current !== "object" || visited.has(current)) {
			continue;
		}
		visited.add(current);
		for (const [key, nestedValue] of Object.entries(current)) {
			const normalizedKey = key.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
			if (candidates.has(normalizedKey)) {
				return nestedValue;
			}
			if (nestedValue && typeof nestedValue === "object") {
				queue.push(nestedValue);
			}
		}
	}
	return undefined;
}

export function DashboardDetailBody({
	error,
	fields = [],
	isLoading = false,
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
				</div>
			</div>
		);
	}

	return (
		<ScrollArea className="dashboard-detail-scroll">
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
