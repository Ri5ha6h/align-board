"use client";

type AbortSessionRefresh = () => void;

let abortSessionRefreshHandler: AbortSessionRefresh | null = null;

export const registerSessionRefreshAbort = (handler: AbortSessionRefresh) => {
	abortSessionRefreshHandler = handler;

	return () => {
		if (abortSessionRefreshHandler === handler) {
			abortSessionRefreshHandler = null;
		}
	};
};

export const abortActiveSessionRefresh = () => {
	abortSessionRefreshHandler?.();
};

export const requestSessionRefresh = (signal: AbortSignal) =>
	fetch("/api/session/refresh", {
		cache: "no-store",
		credentials: "same-origin",
		method: "POST",
		signal,
	});
