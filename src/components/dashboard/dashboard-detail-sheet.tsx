"use client";

import { AlertTriangle, Check, CircleAlert, Copy, Loader2, RefreshCw } from "lucide-react";
import * as React from "react";

import { DashboardSkeleton } from "@/components/dashboard/dashboard-loading";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardDetailField {
	label: string;
	value: unknown;
}

type CopyState = "idle" | "copied" | "failed";

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

const COPY_FEEDBACK_DURATION_MS = 2000;

export function DashboardDetailBody({
	error,
	fields = [],
	isLoading = false,
	isRefreshing = false,
	onRetry,
	rawValue,
}: DashboardDetailBodyProps) {
	const [copyState, setCopyState] = React.useState<CopyState>("idle");
	const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const rawJson = JSON.stringify(rawValue ?? {}, null, 2);

	React.useEffect(() => {
		return () => {
			if (resetTimerRef.current) {
				clearTimeout(resetTimerRef.current);
			}
		};
	}, []);

	const handleCopy = async () => {
		if (resetTimerRef.current) {
			clearTimeout(resetTimerRef.current);
		}

		try {
			await navigator.clipboard.writeText(rawJson);
			setCopyState("copied");
		} catch {
			setCopyState("failed");
		}

		resetTimerRef.current = setTimeout(() => {
			setCopyState("idle");
			resetTimerRef.current = null;
		}, COPY_FEEDBACK_DURATION_MS);
	};

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
					<div className="dashboard-raw-payload-header">
						<AccordionTrigger>Raw JSON</AccordionTrigger>
						<Button
							aria-label={
								copyState === "copied"
									? "Raw JSON copied"
									: copyState === "failed"
										? "Raw JSON copy failed"
										: "Copy raw JSON"
							}
							className="dashboard-raw-copy"
							onClick={handleCopy}
							size="sm"
							type="button"
							variant="ghost"
						>
							{copyState === "copied" ? (
								<Check aria-hidden="true" />
							) : copyState === "failed" ? (
								<CircleAlert aria-hidden="true" />
							) : (
								<Copy aria-hidden="true" />
							)}
							<span aria-live="polite">
								{copyState === "copied"
									? "Copied"
									: copyState === "failed"
										? "Copy failed"
										: "Copy"}
							</span>
						</Button>
					</div>
					<AccordionContent>
						<pre>{rawJson}</pre>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</ScrollArea>
	);
}
