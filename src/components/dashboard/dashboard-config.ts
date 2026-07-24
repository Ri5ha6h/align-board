import {
	Activity,
	ChartNoAxesCombined,
	Clock3,
	History,
	type LucideIcon,
	RadioTower,
} from "lucide-react";

export const DASHBOARD_MODES = [
	"ocean",
	"air",
	"terminal",
	"road",
	"intermodal",
	"freight",
	"load",
] as const;
export const DASHBOARD_ENVS = ["prod", "dev"] as const;
const DASHBOARD_VIEWS = [
	"status",
	"summary",
	"references",
	"latency",
	"history",
	"induced",
] as const;

export type DashboardMode = (typeof DASHBOARD_MODES)[number];
export type DashboardEnv = (typeof DASHBOARD_ENVS)[number];
export type DashboardView = (typeof DASHBOARD_VIEWS)[number];

export interface DashboardViewConfig {
	description: string;
	icon: LucideIcon;
	label: string;
	title: string;
}

export const DASHBOARD_VIEW_CONFIG: Record<DashboardView, DashboardViewConfig> = {
	status: {
		label: "Status",
		title: "Tracking Status",
		description: "Monitor current and historical tracking service notices across carriers.",
		icon: RadioTower,
	},
	summary: {
		label: "Summary",
		title: "Tracking Summary",
		description: "Review crawl outcomes and throughput across the selected carriers and queue.",
		icon: ChartNoAxesCombined,
	},
	references: {
		label: "References",
		title: "Tracking References",
		description: "Inspect tracked references by filters, subscription, or reference number.",
		icon: Activity,
	},
	latency: {
		label: "Latency",
		title: "Tracking Latency",
		description: "Compare reference volumes across crawl-latency bands.",
		icon: Clock3,
	},
	history: {
		label: "History",
		title: "Tracking History",
		description: "Trace crawl attempts and payload outcomes for a subscription.",
		icon: History,
	},
	induced: {
		label: "Induced",
		title: "Induced Latency",
		description: "Compare annual induced latency trends across selected ocean carriers.",
		icon: ChartNoAxesCombined,
	},
};

export function isDashboardMode(value: string): value is DashboardMode {
	return DASHBOARD_MODES.includes(value as DashboardMode);
}

export function isDashboardEnv(value: string): value is DashboardEnv {
	return DASHBOARD_ENVS.includes(value as DashboardEnv);
}

export function isDashboardView(value: string): value is DashboardView {
	return DASHBOARD_VIEWS.includes(value as DashboardView);
}

export function getDashboardViews(mode: DashboardMode): DashboardView[] {
	return mode === "ocean"
		? [...DASHBOARD_VIEWS]
		: DASHBOARD_VIEWS.filter((view) => view !== "induced");
}

export function dashboardPath(mode: DashboardMode, env: DashboardEnv, view: DashboardView) {
	return `/dashboard/tracking/${mode}/${env}/${view}`;
}
