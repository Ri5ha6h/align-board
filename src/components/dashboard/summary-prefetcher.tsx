"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { DASHBOARD_MODES } from "@/components/dashboard/dashboard-config";
import { summaryQueryOptions } from "@/utils/query";

interface SummaryPrefetcherProps {
	enabled: boolean;
}

type IdleWindow = Window &
	typeof globalThis & {
		cancelIdleCallback?: (handle: number) => void;
		requestIdleCallback?: (callback: IdleRequestCallback) => number;
	};

export function SummaryPrefetcher({ enabled }: SummaryPrefetcherProps) {
	const queryClient = useQueryClient();
	const startedRef = React.useRef(false);

	React.useEffect(() => {
		if (!enabled || startedRef.current) {
			return;
		}

		startedRef.current = true;
		let cancelled = false;
		const idleWindow = window as IdleWindow;

		const warmSummaries = async () => {
			let modeIndex = 0;
			const worker = async () => {
				while (modeIndex < DASHBOARD_MODES.length) {
					if (cancelled) {
						return;
					}
					const mode = DASHBOARD_MODES[modeIndex];
					modeIndex += 1;
					try {
						await queryClient.prefetchQuery({
							...summaryQueryOptions({
								carriers: [],
								endTime: "",
								env: "prod",
								mode,
								queue: "NORMAL",
								startTime: "",
							}),
							retry: false,
						});
					} catch {
						// Foreground queries own retries and user-visible errors.
					}
				}
			};

			await Promise.all([worker(), worker()]);
		};

		const start = () => {
			void warmSummaries();
		};
		const idleHandle = idleWindow.requestIdleCallback?.(start);
		const timeoutHandle = idleHandle === undefined ? window.setTimeout(start, 0) : undefined;

		return () => {
			cancelled = true;
			if (idleHandle !== undefined) {
				idleWindow.cancelIdleCallback?.(idleHandle);
			}
			if (timeoutHandle !== undefined) {
				window.clearTimeout(timeoutHandle);
			}
		};
	}, [enabled, queryClient]);

	return null;
}
