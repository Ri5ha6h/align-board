"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { useDashboardRuntime } from "@/components/dashboard/dashboard-runtime";

const MINIMUM_FEEDBACK_MS = 400;
const ROUTE_ADOPTION_GRACE_MS = 100;

interface FilterTransaction {
	startedAt: number;
	target: string;
}

interface DashboardFilterTransactionValue {
	begin: (query: string, onSettled?: () => void) => void;
	isPending: boolean;
	reset: (resetForm: () => void) => void;
}

const DashboardFilterTransactionContext =
	React.createContext<DashboardFilterTransactionValue | null>(null);

function canonicalQuery(value: string) {
	const params = new URLSearchParams(value);
	params.sort();
	return params.toString();
}

export function DashboardFilterTransactionProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const runtime = useDashboardRuntime();
	const [transaction, setTransaction] = React.useState<FilterTransaction | null>(null);
	const routeAdoptedAtRef = React.useRef<number | null>(null);
	const pendingRef = React.useRef(false);
	const onSettledRef = React.useRef<(() => void) | undefined>(undefined);
	const currentTarget = `${pathname}?${canonicalQuery(searchParams.toString())}`;

	const begin = React.useCallback(
		(query: string, onSettled?: () => void) => {
			if (pendingRef.current || transaction) return;
			const canonical = canonicalQuery(query);
			const target = `${pathname}?${canonical}`;
			if (target === currentTarget) {
				onSettled?.();
				return;
			}
			onSettledRef.current = onSettled;
			pendingRef.current = true;
			routeAdoptedAtRef.current = null;
			setTransaction({ startedAt: Date.now(), target });
			router.push(`${pathname}${canonical ? `?${canonical}` : ""}`);
		},
		[currentTarget, pathname, router, transaction],
	);

	const reset = React.useCallback(
		(resetForm: () => void) => {
			if (transaction) return;
			const nextParams = new URLSearchParams();
			const category = searchParams.get("category");
			if (category) nextParams.set("category", category);
			resetForm();
			begin(nextParams.toString());
		},
		[begin, searchParams, transaction],
	);

	React.useEffect(() => {
		if (
			!transaction ||
			currentTarget !== transaction.target ||
			routeAdoptedAtRef.current !== null
		) {
			return;
		}
		routeAdoptedAtRef.current = Date.now();
	}, [currentTarget, transaction]);

	React.useEffect(() => {
		const routeAdoptedAt = routeAdoptedAtRef.current;
		if (!transaction || routeAdoptedAt === null || runtime.isFetching) return;
		if (runtime.phase === "loading") return;

		const elapsed = Date.now() - transaction.startedAt;
		const routeElapsed = Date.now() - routeAdoptedAt;
		const remaining = Math.max(
			MINIMUM_FEEDBACK_MS - elapsed,
			ROUTE_ADOPTION_GRACE_MS - routeElapsed,
			0,
		);
		const timeout = window.setTimeout(() => {
			onSettledRef.current?.();
			onSettledRef.current = undefined;
			pendingRef.current = false;
			setTransaction(null);
			routeAdoptedAtRef.current = null;
		}, remaining);

		return () => window.clearTimeout(timeout);
	}, [currentTarget, runtime.isFetching, runtime.phase, transaction]);

	const value = React.useMemo(
		() => ({ begin, isPending: transaction !== null, reset }),
		[begin, reset, transaction],
	);

	return (
		<DashboardFilterTransactionContext.Provider value={value}>
			{children}
		</DashboardFilterTransactionContext.Provider>
	);
}

export function useDashboardFilterTransaction() {
	const value = React.useContext(DashboardFilterTransactionContext);
	if (!value) {
		throw new Error(
			"useDashboardFilterTransaction must be used inside DashboardFilterTransactionProvider",
		);
	}
	return value;
}
