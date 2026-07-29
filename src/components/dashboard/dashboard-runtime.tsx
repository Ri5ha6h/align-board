"use client";

import * as React from "react";

import { dashboardEmptyState } from "@/components/dashboard/dashboard-styles";

type DashboardQueryPhase = "waiting" | "loading" | "live" | "empty" | "error";

export interface DashboardQuerySnapshot {
	data: unknown[];
	error?: string;
	isFetching: boolean;
	phase: DashboardQueryPhase;
}

interface DashboardRuntimeValue extends DashboardQuerySnapshot {
	report: (snapshot: DashboardQuerySnapshot) => void;
}

const DEFAULT_SNAPSHOT: DashboardQuerySnapshot = {
	data: [],
	isFetching: false,
	phase: "waiting",
};

const DashboardRuntimeContext = React.createContext<DashboardRuntimeValue | null>(null);

export function DashboardRuntimeProvider({ children }: { children: React.ReactNode }) {
	const [snapshot, setSnapshot] = React.useState(DEFAULT_SNAPSHOT);
	const report = React.useCallback((next: DashboardQuerySnapshot) => {
		setSnapshot((current) => {
			if (
				current.data === next.data &&
				current.error === next.error &&
				current.isFetching === next.isFetching &&
				current.phase === next.phase
			) {
				return current;
			}
			return next;
		});
	}, []);
	const value = React.useMemo(() => ({ ...snapshot, report }), [snapshot, report]);

	return (
		<DashboardRuntimeContext.Provider value={value}>
			{children}
		</DashboardRuntimeContext.Provider>
	);
}

export function useDashboardRuntime() {
	const value = React.useContext(DashboardRuntimeContext);
	if (!value) {
		throw new Error("useDashboardRuntime must be used inside DashboardRuntimeProvider");
	}
	return value;
}

export function useDashboardQueryReport({
	data,
	error,
	isFetching,
	isPending,
	isWaiting = false,
	success,
}: {
	data?: unknown;
	error?: Error | null;
	isFetching: boolean;
	isPending: boolean;
	isWaiting?: boolean;
	success?: boolean;
}) {
	const { report } = useDashboardRuntime();
	const rows = React.useMemo(() => {
		if (!data || typeof data !== "object" || !("data" in data)) return [];
		const payload = (data as { data?: unknown }).data;
		return Array.isArray(payload) ? payload : [];
	}, [data]);

	React.useEffect(() => {
		if (isWaiting) {
			report({ data: [], isFetching: false, phase: "waiting" });
		} else if (isPending) {
			report({ data: [], isFetching: true, phase: "loading" });
		} else if (error || success === false) {
			const apiMessage =
				data && typeof data === "object" && "data" in data
					? String((data as { data?: unknown }).data ?? "")
					: "";
			const isEmptyResponse = /(no data|not found|operational)/i.test(apiMessage) && !error;
			report(
				isEmptyResponse
					? { data: [], isFetching, phase: "empty" }
					: {
							data: rows,
							error: error?.message || apiMessage || "Unable to load dashboard data.",
							isFetching,
							phase: "error",
						},
			);
		} else {
			report({
				data: rows,
				isFetching,
				phase: rows.length ? "live" : "empty",
			});
		}
	}, [data, error, isFetching, isPending, isWaiting, report, rows, success]);
}

export function DashboardWaitingState({ children }: { children: React.ReactNode }) {
	useDashboardQueryReport({
		isFetching: false,
		isPending: false,
		isWaiting: true,
	});
	return <output className={dashboardEmptyState}>{children}</output>;
}
