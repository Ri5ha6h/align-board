"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { refreshSessionAction, signOutAction } from "@/actions/auth-actions";
import {
	SESSION_ACTIVITY_STORAGE_KEY,
	SESSION_IDLE_TIMEOUT_MS,
	SESSION_LOGOUT_EVENT,
} from "@/lib/session-constants";

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
	const router = useRouter();
	const stateRef = useRef<ActivityState>({ lastActivityAt: 0, lastRefreshAt: 0 });
	const lastActivityWriteRef = useRef(0);
	const isRefreshingRef = useRef(false);
	const isSigningOutRef = useRef(false);
	const refreshPromiseRef = useRef<ReturnType<typeof refreshSessionAction> | null>(null);

	const expireSession = useCallback(async () => {
		if (isSigningOutRef.current) {
			return;
		}

		isSigningOutRef.current = true;
		try {
			await refreshPromiseRef.current;
		} catch {
			// Continue with sign-out after a failed refresh.
		}

		try {
			await signOutAction();
		} catch {
			// Local expiry must complete even if server invalidation fails.
		} finally {
			try {
				localStorage.removeItem(SESSION_ACTIVITY_STORAGE_KEY);
			} catch {
				// Continue redirecting when browser storage is unavailable.
			}
			router.replace("/signin");
			router.refresh();
		}
	}, [router]);

	useEffect(() => {
		const now = Date.now();
		const initialState = { lastActivityAt: now, lastRefreshAt: 0 };
		stateRef.current = initialState;
		lastActivityWriteRef.current = now;
		writeActivityState(initialState);

		const recordActivity = () => {
			if (isSigningOutRef.current) {
				return;
			}

			const activityAt = Date.now();
			if (activityAt - stateRef.current.lastActivityAt >= SESSION_IDLE_TIMEOUT_MS) {
				void expireSession();
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
				void expireSession();
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
			if (isSigningOutRef.current) {
				return;
			}

			const currentTime = Date.now();
			const state = stateRef.current;

			if (currentTime - state.lastActivityAt >= SESSION_IDLE_TIMEOUT_MS) {
				await expireSession();
				return;
			}

			const hasUnrefreshedActivity = state.lastActivityAt > state.lastRefreshAt;
			const canRefresh = currentTime - state.lastRefreshAt >= SESSION_REFRESH_INTERVAL_MS;

			if (!hasUnrefreshedActivity || !canRefresh || isRefreshingRef.current) {
				return;
			}

			isRefreshingRef.current = true;
			const reservedState = { ...state, lastRefreshAt: currentTime };
			stateRef.current = reservedState;
			writeActivityState(reservedState);

			const refreshPromise = refreshSessionAction();
			refreshPromiseRef.current = refreshPromise;

			try {
				const result = await refreshPromise;
				if (!result.success) {
					await expireSession();
				}
			} catch {
				await expireSession();
			} finally {
				if (refreshPromiseRef.current === refreshPromise) {
					refreshPromiseRef.current = null;
				}
				isRefreshingRef.current = false;
			}
		};

		window.addEventListener("keydown", recordActivity);
		window.addEventListener("pointerdown", recordActivity, { passive: true });
		window.addEventListener("scroll", recordActivity, { passive: true });
		window.addEventListener("touchstart", recordActivity, { passive: true });
		window.addEventListener("focus", recordActivity);
		window.addEventListener(SESSION_LOGOUT_EVENT, expireSession);
		window.addEventListener("storage", syncActivity);
		document.addEventListener("visibilitychange", recordVisibleActivity);

		const sessionCheck = window.setInterval(() => {
			void checkSession();
		}, SESSION_CHECK_INTERVAL_MS);

		return () => {
			window.clearInterval(sessionCheck);
			window.removeEventListener("keydown", recordActivity);
			window.removeEventListener("pointerdown", recordActivity);
			window.removeEventListener("scroll", recordActivity);
			window.removeEventListener("touchstart", recordActivity);
			window.removeEventListener("focus", recordActivity);
			window.removeEventListener(SESSION_LOGOUT_EVENT, expireSession);
			window.removeEventListener("storage", syncActivity);
			document.removeEventListener("visibilitychange", recordVisibleActivity);
		};
	}, [expireSession]);

	return null;
};
