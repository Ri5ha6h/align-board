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
			<div
				className="mt-3 flex gap-3 border border-[color-mix(in_srgb,var(--color-dashboard-danger)_55%,transparent)] p-3.5 text-dashboard-danger [&_svg]:w-4 [&_svg]:shrink-0"
				role="alert"
			>
				<AlertTriangle aria-hidden="true" />
				<div>
					<strong className="text-[13px]">Details unavailable</strong>
					<p className="mt-1 text-xs text-dashboard-mist">
						{error} Try opening this result again.
					</p>
					{onRetry ? (
						<Button
							className="mt-3 border-dashboard-line bg-dashboard-night text-dashboard-white"
							onClick={onRetry}
							size="sm"
							type="button"
							variant="outline"
						>
							<RefreshCw aria-hidden="true" />
							Retry
						</Button>
					) : null}
				</div>
			</div>
		);
	}

	return (
		<ScrollArea className="min-h-0 flex-1">
			{isRefreshing ? (
				<div
					aria-live="polite"
					className="mt-3.5 flex items-center gap-[7px] font-dashboard-code text-[9px] tracking-[0.06em] text-dashboard-mist uppercase"
				>
					<Loader2
						aria-hidden="true"
						className="size-[13px] animate-dashboard-spin motion-reduce:animate-none"
					/>
					Updating details…
				</div>
			) : null}
			<div className="mt-2 grid grid-cols-2 gap-px border border-dashboard-line bg-dashboard-line max-[651px]:grid-cols-1">
				{fields.map((field) => (
					<div className="min-w-0 bg-dashboard-ink p-[13px]" key={field.label}>
						<span className="block font-dashboard-code text-[8px] tracking-[0.08em] text-dashboard-mist uppercase">
							{field.label}
						</span>
						<strong className="mt-1.5 block font-dashboard-code text-[11px] leading-[1.45] font-normal [overflow-wrap:anywhere] text-dashboard-white">
							{displayValue(field.value)}
						</strong>
					</div>
				))}
			</div>
			<Accordion collapsible className="mt-[18px] border border-dashboard-line" type="single">
				<AccordionItem className="border-0" value="payload">
					<div className="flex items-center [&>:first-child]:min-w-0 [&>:first-child]:flex-1">
						<AccordionTrigger className="p-[13px] font-dashboard-code text-[9px] tracking-[0.08em] text-dashboard-white uppercase">
							Raw JSON
						</AccordionTrigger>
						<Button
							aria-label={
								copyState === "copied"
									? "Raw JSON copied"
									: copyState === "failed"
										? "Raw JSON copy failed"
										: "Copy raw JSON"
							}
							className="mr-2 min-w-[92px] rounded-[2px] border border-transparent font-dashboard-code text-[9px] tracking-[0.04em] text-dashboard-mist hover:border-dashboard-line hover:bg-dashboard-night hover:text-dashboard-white focus-visible:border-dashboard-white focus-visible:ring-2 focus-visible:ring-[rgba(250,250,250,0.18)] [&_svg]:size-[13px]"
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
					<AccordionContent className="[&>div]:p-0">
						<pre className="max-h-[45vh] overflow-auto border-t border-dashboard-line bg-[#18181b] p-3.5 font-dashboard-code text-[10px] leading-[1.55] [overflow-wrap:anywhere] whitespace-pre-wrap text-[#d4d4d8]">
							{rawJson}
						</pre>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</ScrollArea>
	);
}
