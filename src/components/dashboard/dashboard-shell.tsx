"use client";

import { HelpCircle, Menu, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import {
	AllReferenceAccordion,
	HistoryAccordion,
	InducedAccordion,
	LatencyAccordion,
	ReferenceAccordion,
	StatusAccordion,
	SubscriptionAccordion,
	SummaryAccordion,
} from "@/components/accord-util";
import { SignOutComponent } from "@/components/sign-out-component";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type {
	HistoryType,
	InducedChartType,
	LatencyTableType,
	ReferenceTableType,
	StatusColumnType,
	SummaryType,
} from "@/utils/common-types";

import {
	DASHBOARD_ENVS,
	DASHBOARD_MODES,
	DASHBOARD_VIEW_CONFIG,
	dashboardPath,
	type DashboardEnv,
	type DashboardMode,
	type DashboardView,
	getDashboardViews,
} from "./dashboard-config";
import { DashboardFilterTransactionProvider } from "./dashboard-filter-transaction";
import { DashboardSkeleton } from "./dashboard-loading";
import { DashboardRuntimeProvider, useDashboardRuntime } from "./dashboard-runtime";
import {
	dashboardContent,
	dashboardDialog,
	dashboardEyebrow,
	dashboardFocusRing,
	dashboardSelectContent,
	dashboardSheet,
	dashboardUtilityButton,
} from "./dashboard-styles";
import { SummaryPrefetcher } from "./summary-prefetcher";

interface DashboardShellProps {
	children: React.ReactNode;
	env: DashboardEnv;
	mode: DashboardMode;
	view: DashboardView;
}

const QUERY_STATE_LABEL = {
	waiting: "Waiting for filters",
	loading: "Loading",
	live: "Live data",
	empty: "No results",
	error: "Query error",
} as const;

const QUERY_STATE_DOT = {
	waiting: "bg-dashboard-mist",
	loading: "animate-dashboard-pulse bg-dashboard-mist motion-reduce:animate-none",
	live: "bg-dashboard-white shadow-[0_0_0_3px_rgba(250,250,250,0.1)]",
	empty: "bg-dashboard-mist",
	error: "bg-dashboard-danger",
} as const;

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function sum<T>(rows: T[], select: (row: T) => number): number {
	return rows.reduce<number>((total, row) => total + (Number(select(row)) || 0), 0);
}

function formatNumber(value: number) {
	return NUMBER_FORMATTER.format(value);
}

function getKpis(
	view: DashboardView,
	rows: unknown[],
	searchParams: Pick<URLSearchParams, "get">,
): ReadonlyArray<readonly [string, string | number]> {
	if (view === "status") {
		const statusRows = rows as StatusColumnType[];
		return [
			["Total", statusRows.length],
			[
				"Degradation",
				statusRows.filter((row) => row.value?.statusType === "DEGRADATION").length,
			],
			[
				"Maintenance",
				statusRows.filter((row) =>
					["WEBSITE MAINTENANCE", "SYSTEM MAINTENANCE"].includes(row.value?.statusType),
				).length,
			],
			[
				"Information",
				statusRows.filter((row) => row.value?.statusType === "INFORMATION").length,
			],
		] as const;
	}
	if (view === "summary") {
		const summaryRows = rows as SummaryType[];
		return [
			["Crawled", sum(summaryRows, (row) => row.jtCrawledTotal)],
			["Success", sum(summaryRows, (row) => row.successCount)],
			["Failed", sum(summaryRows, (row) => row.failCount)],
			["Reference not found", sum(summaryRows, (row) => row.getReferenceNotFound)],
		] as const;
	}
	if (view === "history") {
		const historyRows = rows as HistoryType[];
		const latency: number[] = [];
		for (const row of historyRows) {
			const value = Number(row.v?.jtLatencyInMinutes);
			if (Number.isFinite(value)) {
				latency.push(value);
			}
		}
		return [
			["Total crawls", historyRows.length],
			["Successful", historyRows.filter((row) => row.v?.crawl_status === "SUCCESS").length],
			["Failed", historyRows.filter((row) => row.v?.crawl_status === "FAILED").length],
			[
				"Average latency",
				latency.length
					? `${formatNumber(sum(latency, (value) => value) / latency.length)}m`
					: "—",
			],
		] as const;
	}
	if (view === "references") {
		const referenceRows = rows as ReferenceTableType[];
		const carriers = new Set<string>();
		for (const row of referenceRows) {
			if (row.carrier) {
				carriers.add(row.carrier);
			}
		}
		const selectedCarrier = searchParams.get("carrier") || searchParams.get("refCarrier") || "";
		const selectedStatus = searchParams.get("refStatus")?.toUpperCase();
		const hasRowStatus = referenceRows.some((row) => row.status);
		return [
			["Results", referenceRows.length],
			["Unique carriers", carriers.size || (selectedCarrier ? 1 : "—")],
			[
				"Active",
				hasRowStatus
					? referenceRows.filter((row) => row.status?.toUpperCase() === "ACTIVE").length
					: selectedStatus === "ACTIVE"
						? referenceRows.length
						: selectedStatus === "CLOSED"
							? 0
							: "—",
			],
			[
				"Closed",
				hasRowStatus
					? referenceRows.filter((row) => row.status?.toUpperCase() === "CLOSED").length
					: selectedStatus === "CLOSED"
						? referenceRows.length
						: selectedStatus === "ACTIVE"
							? 0
							: "—",
			],
		] as const;
	}
	if (view === "latency") {
		const latencyRows = rows as LatencyTableType[];
		return [
			[
				"Total references",
				sum(
					latencyRows,
					(row) =>
						row.first +
						row.second +
						row.third +
						row.fourth +
						row.fifth +
						row.sixth +
						row.seventh +
						row.eight +
						row.ninth +
						row.tenth,
				),
			],
			["0–4h", sum(latencyRows, (row) => row.first + row.second + row.third)],
			["4–24h", sum(latencyRows, (row) => row.fourth + row.fifth + row.sixth + row.seventh)],
			["Over 24h", sum(latencyRows, (row) => row.eight + row.ninth + row.tenth)],
		] as const;
	}
	const inducedRows = rows as Array<InducedChartType & Record<string, unknown>>;
	const values: number[] = [];
	for (const row of inducedRows) {
		for (const [key, rawValue] of Object.entries(row)) {
			const value = Number(rawValue);
			if (key !== "date" && Number.isFinite(value)) {
				values.push(value);
			}
		}
	}
	const latestValues: number[] = [];
	for (const [key, rawValue] of Object.entries(inducedRows.at(-1) ?? {})) {
		const value = Number(rawValue);
		if (key !== "date" && Number.isFinite(value)) {
			latestValues.push(value);
		}
	}
	const latest = latestValues.length
		? sum(latestValues, (value) => value) / latestValues.length
		: undefined;
	return [
		["Data points", inducedRows.length],
		[
			"Average latency",
			values.length ? formatNumber(sum(values, (value) => value) / values.length) : "—",
		],
		["Peak latency", values.length ? formatNumber(Math.max(...values)) : "—"],
		["Latest latency", latest === undefined ? "—" : formatNumber(latest)],
	] as const;
}

function formatKpiValue(value: string | number) {
	return typeof value === "number" ? formatNumber(value) : value;
}

function HelpDialog({
	mode,
	referenceCategory,
	view,
}: {
	mode: DashboardMode;
	referenceCategory: string;
	view: DashboardView;
}) {
	const content =
		view === "status" ? (
			<StatusAccordion />
		) : view === "summary" ? (
			<SummaryAccordion />
		) : view === "history" ? (
			<HistoryAccordion />
		) : view === "latency" ? (
			<LatencyAccordion mode={mode} />
		) : view === "induced" ? (
			<InducedAccordion />
		) : referenceCategory === "subscription" ? (
			<SubscriptionAccordion />
		) : referenceCategory === "reference" ? (
			<ReferenceAccordion />
		) : (
			<AllReferenceAccordion />
		);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className={dashboardUtilityButton} size="sm" variant="outline">
					<HelpCircle />
					Help
				</Button>
			</DialogTrigger>
			<DialogContent className={dashboardDialog} data-dashboard-surface>
				<DialogHeader>
					<DialogTitle>{DASHBOARD_VIEW_CONFIG[view].label} guide</DialogTitle>
					<DialogDescription>
						Operational notes for this dashboard and its filters.
					</DialogDescription>
				</DialogHeader>
				{content}
			</DialogContent>
		</Dialog>
	);
}

function QueryState() {
	const { error, phase } = useDashboardRuntime();
	return (
		<div className="rounded-[2px] border border-dashboard-line bg-dashboard-ink p-3.5 font-dashboard-code text-[10px] tracking-[0.04em] uppercase">
			<div className="flex items-center gap-2 font-medium text-dashboard-white">
				<span className={cn("size-1.5 rounded-full", QUERY_STATE_DOT[phase])} />
				<span>{QUERY_STATE_LABEL[phase]}</span>
			</div>
			<p className="mt-2 font-dashboard-body text-[10px] leading-[1.45] tracking-normal text-dashboard-mist normal-case">
				{error || "Reflects the active dashboard request only."}
			</p>
		</div>
	);
}

function DashboardNavigation({
	env,
	mode,
	view,
	onNavigate,
	className,
}: {
	className?: string;
	env: DashboardEnv;
	mode: DashboardMode;
	onNavigate?: () => void;
	view: DashboardView;
}) {
	return (
		<nav aria-label="Dashboard views" className={cn("flex flex-col gap-[3px]", className)}>
			<p className="mx-3 mt-0 mb-[11px] font-dashboard-code text-[9px] font-medium tracking-[0.12em] text-dashboard-mist uppercase">
				Dashboards
			</p>
			{getDashboardViews(mode).map((item) => {
				const config = DASHBOARD_VIEW_CONFIG[item];
				const Icon = config.icon;
				return (
					<Link
						aria-current={item === view ? "page" : undefined}
						className={cn(
							"flex h-[42px] items-center gap-3 rounded-[2px] border border-transparent px-3 text-[13px] font-semibold text-dashboard-mist transition-[color,background,border-color] duration-150 hover:text-dashboard-white [&_svg]:w-[15px]",
							dashboardFocusRing,
							item === view &&
								"border-dashboard-line bg-dashboard-ink text-dashboard-white",
						)}
						href={dashboardPath(mode, env, item)}
						key={item}
						onClick={onNavigate}
					>
						<Icon />
						{config.label}
					</Link>
				);
			})}
		</nav>
	);
}

function DashboardShellInner({ children, env, mode, view }: DashboardShellProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [menuOpen, setMenuOpen] = React.useState(false);
	const runtime = useDashboardRuntime();
	const viewConfig = DASHBOARD_VIEW_CONFIG[view];
	const kpis = React.useMemo(
		() => getKpis(view, runtime.data, searchParams),
		[runtime.data, searchParams, view],
	);

	const switchEnvironment = (nextEnv: DashboardEnv) => {
		const query = searchParams.toString();
		router.push(`${dashboardPath(mode, nextEnv, view)}${query ? `?${query}` : ""}`);
	};

	const switchMode = (nextMode: DashboardMode) => {
		const nextView = view === "induced" && nextMode !== "ocean" ? "status" : view;
		router.push(dashboardPath(nextMode, env, nextView));
	};

	return (
		<div
			className="min-h-screen bg-dashboard-night font-dashboard-body text-dashboard-white [color-scheme:dark]"
			data-dashboard-root
		>
			<SummaryPrefetcher
				enabled={
					mode === "ocean" &&
					env === "prod" &&
					view === "status" &&
					!["loading", "waiting"].includes(runtime.phase)
				}
			/>
			<header className="sticky top-0 z-40 grid h-[70px] grid-cols-[230px_minmax(0,1fr)_auto] items-stretch border-b border-dashboard-line bg-[rgba(32,32,35,0.96)] backdrop-blur-[12px] max-[951px]:grid-cols-[auto_minmax(0,1fr)_auto] max-[761px]:grid-cols-[50px_minmax(0,1fr)_auto]">
				<div className="flex items-center gap-3 border-r border-dashboard-line px-5 font-dashboard-code text-[13px] font-medium tracking-[0.14em] uppercase max-[951px]:border-r-0 max-[761px]:px-2">
					<Sheet onOpenChange={setMenuOpen} open={menuOpen}>
						<SheetTrigger asChild>
							<Button
								aria-label="Open dashboard navigation"
								className="hidden text-dashboard-white max-[951px]:inline-flex"
								size="icon"
								variant="ghost"
							>
								<Menu />
							</Button>
						</SheetTrigger>
						<SheetContent className={dashboardSheet} data-dashboard-surface side="left">
							<SheetHeader>
								<SheetTitle>Tracking Dashboards</SheetTitle>
								<SheetDescription>
									Choose a view for {mode} tracking.
								</SheetDescription>
							</SheetHeader>
							<DashboardNavigation
								className="px-4 py-1"
								env={env}
								mode={mode}
								onNavigate={() => setMenuOpen(false)}
								view={view}
							/>
							<div className="mt-auto p-4">
								<QueryState />
							</div>
						</SheetContent>
					</Sheet>
					<Image
						alt=""
						aria-hidden
						className="size-7 object-cover max-[761px]:hidden"
						height={28}
						priority
						src="/alignbits-logo.jpg"
						width={28}
					/>
					<Link
						className={cn(dashboardFocusRing, "max-[761px]:hidden")}
						href="/dashboard"
					>
						Alignbits
					</Link>
				</div>

				<div className="flex min-w-0 items-center px-4 max-[761px]:px-2">
					<Select
						onValueChange={(value) => switchMode(value as DashboardMode)}
						value={mode}
					>
						<SelectTrigger
							aria-label="Tracking mode"
							className="w-full min-w-0 rounded-[2px] border-dashboard-line bg-dashboard-ink font-dashboard-code text-[10px] tracking-[0.08em] text-dashboard-white"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent className={dashboardSelectContent}>
							{DASHBOARD_MODES.map((item) => (
								<SelectItem key={item} value={item}>
									{item.toUpperCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2.5 border-l border-dashboard-line px-[18px] max-[761px]:px-2.5 max-[401px]:gap-1 max-[401px]:px-1.5 [&>button]:h-[34px] [&>button]:rounded-[2px] [&>button]:border [&>button]:border-dashboard-line [&>button]:font-dashboard-code [&>button]:text-[10px] [&>button]:tracking-[0.08em] [&>button]:text-dashboard-panel [&>button]:uppercase max-[761px]:[&>button]:w-9 max-[761px]:[&>button]:p-0 max-[761px]:[&>button_span]:hidden [&>button:hover]:bg-dashboard-panel [&>button:hover]:text-dashboard-night">
					<div
						className="flex h-[34px] rounded-[2px] border border-dashboard-line [&_button]:min-w-12 [&_button]:px-2.5 [&_button]:font-dashboard-code [&_button]:text-[9px] [&_button]:font-medium [&_button]:tracking-[0.1em] [&_button]:text-dashboard-mist [&_button]:uppercase [&_button]:transition-colors max-[651px]:[&_button]:min-w-10 max-[651px]:[&_button]:px-[7px] max-[401px]:[&_button]:min-w-8 max-[401px]:[&_button]:px-1 [&_button+button]:border-l [&_button+button]:border-dashboard-line"
						aria-label="Environment"
					>
						{DASHBOARD_ENVS.map((item) => (
							<button
								aria-pressed={item === env}
								className={cn(
									dashboardFocusRing,
									item === env && "bg-dashboard-panel text-dashboard-night",
								)}
								key={item}
								onClick={() => switchEnvironment(item)}
								type="button"
							>
								{item}
							</button>
						))}
					</div>
					<SignOutComponent compact />
				</div>
			</header>

			<div className="grid min-h-[calc(100vh-70px)] grid-cols-[230px_minmax(0,1fr)] max-[951px]:block">
				<aside className="sticky top-[70px] flex h-[calc(100vh-70px)] flex-col border-r border-dashboard-line bg-dashboard-night [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:32px_32px] p-[26px_16px_18px] max-[951px]:hidden">
					<DashboardNavigation env={env} mode={mode} view={view} />
					<div className="mt-auto">
						<QueryState />
					</div>
				</aside>
				<main className="min-w-0 overflow-hidden px-[clamp(24px,4vw,64px)] pt-11 pb-[60px] max-[951px]:px-[clamp(18px,4vw,38px)] max-[651px]:px-3.5 max-[651px]:pt-7 max-[651px]:pb-[42px]">
					<section className="flex items-start justify-between gap-6 pb-8 max-[651px]:flex-col max-[651px]:pb-6">
						<div>
							<p className={dashboardEyebrow}>
								{mode} / {env} / {view}
							</p>
							<h1 className="text-[clamp(30px,4vw,48px)] leading-none font-semibold tracking-[-0.045em] max-[651px]:text-[32px]">
								{viewConfig.title}
							</h1>
							<p className="mt-3.5 max-w-[620px] text-sm leading-[1.6] text-dashboard-mist">
								{viewConfig.description}
							</p>
						</div>
						<div className="flex items-center gap-2.5 max-[651px]:w-full max-[651px]:justify-between">
							{runtime.isFetching && runtime.phase !== "loading" ? (
								<span className="relative flex h-[34px] items-center gap-[7px] overflow-hidden border border-dashboard-line px-2.5 font-dashboard-code text-[9px] tracking-[0.08em] text-dashboard-mist uppercase after:absolute after:inset-0 after:-translate-x-full after:animate-dashboard-shimmer after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)] after:content-[''] motion-reduce:after:animate-none">
									<RefreshCw className="w-3" />
									Updating
								</span>
							) : null}
							<HelpDialog
								mode={mode}
								referenceCategory={searchParams.get("category") || "all"}
								view={view}
							/>
						</div>
					</section>

					<section
						aria-label={`${viewConfig.label} metrics`}
						className="grid grid-cols-4 border border-dashboard-line max-[651px]:grid-cols-2"
					>
						{kpis.map(([label, value], index) => (
							<div
								className={cn(
									"min-h-28 px-[22px] py-5 max-[651px]:min-h-[92px] max-[651px]:p-4",
									index > 0 && "border-l border-dashboard-line",
									index === 2 && "max-[651px]:border-t max-[651px]:border-l-0",
									index === 3 && "max-[651px]:border-t",
								)}
								key={label}
							>
								<p className="font-dashboard-code text-[9px] font-medium tracking-[0.1em] text-dashboard-mist uppercase">
									{label}
								</p>
								{runtime.phase === "loading" ? (
									<DashboardSkeleton className="mt-3 h-8 w-24" />
								) : (
									<strong className="mt-3 block font-dashboard-code text-[clamp(24px,3vw,34px)] font-normal tracking-[-0.05em]">
										{runtime.phase === "waiting" ? "—" : formatKpiValue(value)}
									</strong>
								)}
							</div>
						))}
					</section>

					<section className={dashboardContent} data-pathname={pathname}>
						{children}
					</section>
				</main>
			</div>
		</div>
	);
}

export function DashboardShell(props: DashboardShellProps) {
	return (
		<DashboardRuntimeProvider key={`${props.mode}-${props.env}-${props.view}`}>
			<DashboardFilterTransactionProvider>
				<DashboardShellInner {...props} />
			</DashboardFilterTransactionProvider>
		</DashboardRuntimeProvider>
	);
}
