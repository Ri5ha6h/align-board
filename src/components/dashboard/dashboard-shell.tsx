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
import { DashboardSkeleton } from "./dashboard-loading";
import { DashboardRuntimeProvider, useDashboardRuntime } from "./dashboard-runtime";

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

function sum<T>(rows: T[], select: (row: T) => number): number {
	return rows.reduce<number>((total, row) => total + (Number(select(row)) || 0), 0);
}

function formatNumber(value: number) {
	return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function getKpis(
	view: DashboardView,
	rows: unknown[],
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
		const latency = historyRows
			.map((row) => Number(row.v?.jtLatencyInMinutes))
			.filter(Number.isFinite);
		return [
			["Total crawls", historyRows.length],
			["Successful", historyRows.filter((row) => row.v?.crawl_status === "SUCCESS").length],
			["Failed", historyRows.filter((row) => row.v?.crawl_status === "FAILED").length],
			[
				"Average JT latency",
				latency.length
					? `${formatNumber(sum(latency, (value) => value) / latency.length)}m`
					: "—",
			],
		] as const;
	}
	if (view === "references") {
		const referenceRows = rows as ReferenceTableType[];
		const carriers = new Set(referenceRows.map((row) => row.carrier).filter(Boolean));
		return [
			["Results", referenceRows.length],
			["Unique carriers", carriers.size || "—"],
			[
				"Active",
				referenceRows.some((row) => row.status)
					? referenceRows.filter((row) => row.status?.toUpperCase() === "ACTIVE").length
					: "—",
			],
			[
				"Closed",
				referenceRows.some((row) => row.status)
					? referenceRows.filter((row) => row.status?.toUpperCase() === "CLOSED").length
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
	const values = inducedRows.flatMap((row) =>
		Object.entries(row)
			.filter(([key]) => key !== "date")
			.map(([, value]) => Number(value))
			.filter(Number.isFinite),
	);
	const latestValues = Object.entries(inducedRows.at(-1) ?? {})
		.filter(([key]) => key !== "date")
		.map(([, value]) => Number(value))
		.filter(Number.isFinite);
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
				<Button className="dashboard-utility-button" size="sm" variant="outline">
					<HelpCircle />
					Help
				</Button>
			</DialogTrigger>
			<DialogContent className="dashboard-dialog">
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
		<div className="dashboard-query-state">
			<div className="flex items-center gap-2">
				<span className={cn("dashboard-state-dot", `dashboard-state-dot--${phase}`)} />
				<span>{QUERY_STATE_LABEL[phase]}</span>
			</div>
			<p>{error || "Reflects the active dashboard request only."}</p>
		</div>
	);
}

function DashboardNavigation({
	env,
	mode,
	view,
	onNavigate,
}: {
	env: DashboardEnv;
	mode: DashboardMode;
	onNavigate?: () => void;
	view: DashboardView;
}) {
	return (
		<nav aria-label="Dashboard views" className="dashboard-nav">
			<p>Dashboards</p>
			{getDashboardViews(mode).map((item) => {
				const config = DASHBOARD_VIEW_CONFIG[item];
				const Icon = config.icon;
				return (
					<Link
						aria-current={item === view ? "page" : undefined}
						className={cn("dashboard-nav-link", item === view && "is-active")}
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
	const kpis = React.useMemo(() => getKpis(view, runtime.data), [runtime.data, view]);

	const switchEnvironment = (nextEnv: DashboardEnv) => {
		const query = searchParams.toString();
		router.push(`${dashboardPath(mode, nextEnv, view)}${query ? `?${query}` : ""}`);
	};

	const switchMode = (nextMode: DashboardMode) => {
		const nextView = view === "induced" && nextMode !== "ocean" ? "status" : view;
		router.push(dashboardPath(nextMode, env, nextView));
	};

	return (
		<div className="dashboard-dispatch">
			<header className="dashboard-topbar">
				<div className="dashboard-brand">
					<Sheet onOpenChange={setMenuOpen} open={menuOpen}>
						<SheetTrigger asChild>
							<Button
								aria-label="Open dashboard navigation"
								className="dashboard-menu-button"
								size="icon"
								variant="ghost"
							>
								<Menu />
							</Button>
						</SheetTrigger>
						<SheetContent className="dashboard-sheet" side="left">
							<SheetHeader>
								<SheetTitle>Tracking dashboards</SheetTitle>
								<SheetDescription>
									Choose a view for {mode} tracking.
								</SheetDescription>
							</SheetHeader>
							<DashboardNavigation
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
						className="size-7 object-cover"
						height={28}
						priority
						src="/alignbits-logo.jpg"
						width={28}
					/>
					<Link href="/dashboard">Alignbits</Link>
				</div>

				<nav className="dashboard-mode-tabs" aria-label="Tracking modes">
					{DASHBOARD_MODES.map((item) => (
						<button
							aria-current={item === mode ? "page" : undefined}
							className={cn(item === mode && "is-active")}
							key={item}
							onClick={() => switchMode(item)}
							type="button"
						>
							{item}
						</button>
					))}
				</nav>
				<Select onValueChange={(value) => switchMode(value as DashboardMode)} value={mode}>
					<SelectTrigger aria-label="Tracking mode" className="dashboard-mode-select">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{DASHBOARD_MODES.map((item) => (
							<SelectItem key={item} value={item}>
								{item.toUpperCase()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="dashboard-topbar-actions">
					<div className="dashboard-env-switch" aria-label="Environment">
						{DASHBOARD_ENVS.map((item) => (
							<button
								aria-pressed={item === env}
								className={cn(item === env && "is-active")}
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

			<div className="dashboard-body">
				<aside className="dashboard-sidebar">
					<DashboardNavigation env={env} mode={mode} view={view} />
					<div className="mt-auto">
						<QueryState />
					</div>
				</aside>
				<main className="dashboard-main">
					<section className="dashboard-masthead">
						<div>
							<p className="dashboard-eyebrow">
								{mode} / {env} / {view}
							</p>
							<h1>{viewConfig.title}</h1>
							<p>{viewConfig.description}</p>
						</div>
						<div className="dashboard-masthead-actions">
							{runtime.isFetching && runtime.phase !== "loading" ? (
								<span className="dashboard-updating">
									<RefreshCw />
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

					<section aria-label={`${viewConfig.label} metrics`} className="dashboard-kpis">
						{kpis.map(([label, value]) => (
							<div className="dashboard-kpi" key={label}>
								<p>{label}</p>
								{runtime.phase === "loading" ? (
									<DashboardSkeleton className="mt-3 h-8 w-24" />
								) : (
									<strong>
										{runtime.phase === "waiting" ? "—" : formatKpiValue(value)}
									</strong>
								)}
							</div>
						))}
					</section>

					<section className="dashboard-content" data-pathname={pathname}>
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
			<DashboardShellInner {...props} />
		</DashboardRuntimeProvider>
	);
}
