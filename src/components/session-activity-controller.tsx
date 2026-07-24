"use client";

import { useCallback, useEffect, useRef } from "react";

import { useLogoutCoordinator } from "@/components/logout-coordinator";
import { SESSION_ACTIVITY_STORAGE_KEY, SESSION_IDLE_TIMEOUT_MS } from "@/lib/session-constants";
import { registerSessionRefreshAbort, requestSessionRefresh } from "@/lib/session-refresh-client";

const ACTIVITY_WRITE_THROTTLE_MS = 1000;
const SESSION_REFRESH_INTERVAL_MS = 15_000;
const SESSION_CHECK_INTERVAL_MS = 1000;

type ActivityState = {
	lastActivityAt: number;
	lastRefreshAt: number;
};

const isActivityState = (value: unknown): value is ActivityState => {
	if (!value || typeof value !== "object") {
		return false;
	}

	const state = value as Partial<ActivityState>;
	return typeof state.lastActivityAt === "number" && typeof state.lastRefreshAt === "number";
};

const writeActivityState = (state: ActivityState) => {
	try {
		localStorage.setItem(SESSION_ACTIVITY_STORAGE_KEY, JSON.stringify(state));
	} catch {
		// In-memory state still enforces inactivity when storage is unavailable.
	}
};

export const SessionActivityController = () => {
	const { beginLogout } = useLogoutCoordinator();
	const stateRef = useRef<ActivityState>({ lastActivityAt: 0, lastRefreshAt: 0 });
	const lastActivityWriteRef = useRef(0);
	const refreshControllerRef = useRef<AbortController | null>(null);

	const expireSession = useCallback(() => beginLogout("idle"), [beginLogout]);

	useEffect(() => {
		const now = Date.now();
		const initialState = { lastActivityAt: now, lastRefreshAt: 0 };
		stateRef.current = initialState;
		lastActivityWriteRef.current = now;
		writeActivityState(initialState);

		const unregisterRefreshAbort = registerSessionRefreshAbort(() => {
			refreshControllerRef.current?.abort();
			refreshControllerRef.current = null;
		});

		const recordActivity = () => {
			const activityAt = Date.now();
			if (activityAt - stateRef.current.lastActivityAt >= SESSION_IDLE_TIMEOUT_MS) {
				expireSession();
				return;
			}

			stateRef.current = { ...stateRef.current, lastActivityAt: activityAt };

			if (activityAt - lastActivityWriteRef.current >= ACTIVITY_WRITE_THROTTLE_MS) {
				lastActivityWriteRef.current = activityAt;
				writeActivityState(stateRef.current);
			}
		};

		const recordVisibleActivity = () => {
			if (document.visibilityState === "visible") {
				recordActivity();
			}
		};

		const syncActivity = (event: StorageEvent) => {
			if (event.key !== SESSION_ACTIVITY_STORAGE_KEY) {
				return;
			}

			if (!event.newValue) {
				return;
			}

			try {
				const state: unknown = JSON.parse(event.newValue);
				if (isActivityState(state)) {
					stateRef.current = state;
				}
			} catch {
				// Ignore malformed activity written by unrelated browser code.
			}
		};

		const checkSession = async () => {
			const currentTime = Date.now();
			const state = stateRef.current;

			if (currentTime - state.lastActivityAt >= SESSION_IDLE_TIMEOUT_MS) {
				expireSession();
				return;
			}

			const hasUnrefreshedActivity = state.lastActivityAt > state.lastRefreshAt;
			const canRefresh = currentTime - state.lastRefreshAt >= SESSION_REFRESH_INTERVAL_MS;

			if (!hasUnrefreshedActivity || !canRefresh || refreshControllerRef.current) {
				return;
			}

			const reservedState = { ...state, lastRefreshAt: currentTime };
			stateRef.current = reservedState;
			writeActivityState(reservedState);

			const controller = new AbortController();
			refreshControllerRef.current = controller;

			try {
				const response = await requestSessionRefresh(controller.signal);
				if (!response.ok) {
					expireSession();
				}
			} catch (error: unknown) {
				if (!(error instanceof DOMException && error.name === "AbortError")) {
					expireSession();
				}
			} finally {
				if (refreshControllerRef.current === controller) {
					refreshControllerRef.current = null;
				}
			}
		};

		window.addEventListener("keydown", recordActivity);
		window.addEventListener("pointerdown", recordActivity, { passive: true });
		window.addEventListener("scroll", recordActivity, { passive: true });
		window.addEventListener("touchstart", recordActivity, { passive: true });
		window.addEventListener("focus", recordActivity);
		window.addEventListener("storage", syncActivity);
		document.addEventListener("visibilitychange", recordVisibleActivity);

		const sessionCheck = window.setInterval(() => {
			void checkSession();
		}, SESSION_CHECK_INTERVAL_MS);

		return () => {
			unregisterRefreshAbort();
			refreshControllerRef.current?.abort();
			refreshControllerRef.current = null;
			window.clearInterval(sessionCheck);
			window.removeEventListener("keydown", recordActivity);
			window.removeEventListener("pointerdown", recordActivity);
			window.removeEventListener("scroll", recordActivity);
			window.removeEventListener("touchstart", recordActivity);
			window.removeEventListener("focus", recordActivity);
			window.removeEventListener("storage", syncActivity);
			document.removeEventListener("visibilitychange", recordVisibleActivity);
		};
	}, [expireSession]);

	return null;
};
