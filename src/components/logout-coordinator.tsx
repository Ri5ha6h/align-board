"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, RotateCcw } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	SESSION_ACTIVITY_STORAGE_KEY,
	SESSION_LOGOUT_EVENT,
	SESSION_LOGOUT_STORAGE_KEY,
} from "@/lib/session-constants";
import { markSessionLogoutQuarantined } from "@/lib/session-logout-client";
import { abortActiveSessionRefresh } from "@/lib/session-refresh-client";

export type LogoutOrigin = "idle" | "manual" | "remote";

interface LogoutContextValue {
	beginLogout: (origin: LogoutOrigin) => void;
}

interface LogoutState {
	origin: LogoutOrigin;
	phase: "active" | "failed";
}

const LOGOUT_TIMEOUT_MS = 5000;
const LogoutContext = React.createContext<LogoutContextValue | null>(null);

export function useLogoutCoordinator() {
	const context = React.useContext(LogoutContext);
	if (!context) {
		throw new Error("useLogoutCoordinator must be used within LogoutCoordinator.");
	}
	return context;
}

export function LogoutCoordinator({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const [logoutState, setLogoutState] = React.useState<LogoutState | null>(null);
	const logoutStartedRef = React.useRef(false);
	const requestInFlightRef = React.useRef(false);

	const performLogout = React.useCallback(async (origin: LogoutOrigin) => {
		if (requestInFlightRef.current) {
			return;
		}

		requestInFlightRef.current = true;
		setLogoutState({ origin, phase: "active" });
		const controller = new AbortController();
		const timeout = window.setTimeout(() => controller.abort(), LOGOUT_TIMEOUT_MS);

		try {
			const response = await fetch("/api/session/logout", {
				cache: "no-store",
				credentials: "same-origin",
				method: "POST",
				signal: controller.signal,
			});
			if (!response.ok) {
				throw new Error("The server did not confirm sign out.");
			}
			window.location.replace("/signin");
		} catch {
			requestInFlightRef.current = false;
			setLogoutState({ origin, phase: "failed" });
		} finally {
			window.clearTimeout(timeout);
		}
	}, []);

	const beginLogout = React.useCallback(
		(origin: LogoutOrigin) => {
			if (logoutStartedRef.current) {
				return;
			}

			logoutStartedRef.current = true;
			markSessionLogoutQuarantined();
			abortActiveSessionRefresh();
			window.dispatchEvent(new Event(SESSION_LOGOUT_EVENT));
			toast.dismiss();
			const cancellation = queryClient.cancelQueries();
			queryClient.clear();
			void cancellation;
			setLogoutState({ origin, phase: "active" });

			if (origin !== "remote") {
				try {
					localStorage.setItem(
						SESSION_LOGOUT_STORAGE_KEY,
						JSON.stringify({ at: Date.now(), version: 1 }),
					);
					localStorage.removeItem(SESSION_ACTIVITY_STORAGE_KEY);
				} catch {
					// The current tab can still complete logout without browser storage.
				}
			}

			void performLogout(origin);
		},
		[performLogout, queryClient],
	);

	React.useEffect(() => {
		const handleRemoteLogout = (event: StorageEvent) => {
			if (event.key === SESSION_LOGOUT_STORAGE_KEY && event.newValue) {
				beginLogout("remote");
			}
		};

		window.addEventListener("storage", handleRemoteLogout);
		return () => window.removeEventListener("storage", handleRemoteLogout);
	}, [beginLogout]);

	const contextValue = React.useMemo(() => ({ beginLogout }), [beginLogout]);

	if (logoutState) {
		const failed = logoutState.phase === "failed";
		return (
			<LogoutContext.Provider value={contextValue}>
				<main
					aria-busy={!failed}
					aria-live="assertive"
					className="fixed inset-0 z-100 grid min-h-dvh place-items-center bg-dashboard-night [background-image:linear-gradient(rgba(68,68,73,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(68,68,73,0.2)_1px,transparent_1px)] [background-size:32px_32px] p-6 font-dashboard-body text-dashboard-white"
					data-dashboard-surface
					role={failed ? "alert" : "status"}
				>
					<div className="flex w-full max-w-[420px] flex-col items-center border border-dashboard-line bg-dashboard-night px-8 py-[38px] text-center shadow-[0_24px_80px_rgba(0,0,0,0.36)] [&>svg]:mb-[18px] [&>svg]:size-[22px] [&>svg]:text-dashboard-mist">
						{failed ? (
							<RefreshCw aria-hidden="true" />
						) : (
							<Loader2
								aria-hidden="true"
								className="animate-dashboard-spin motion-reduce:animate-none"
							/>
						)}
						<p className="mb-2.5 font-dashboard-code text-[9px] font-medium tracking-[0.12em] text-dashboard-mist uppercase">
							Secure session
						</p>
						<h1 className="text-2xl font-semibold tracking-[-0.025em] text-dashboard-white">
							{failed ? "Sign out interrupted" : "Signing out…"}
						</h1>
						<p className="mt-[9px] max-w-[330px] text-xs leading-[1.6] text-dashboard-mist">
							{failed
								? "The server did not confirm that your session was cleared."
								: "Closing this session and clearing dashboard data."}
						</p>
						{failed ? (
							<div className="mt-6 flex w-full gap-2 [&_button]:min-w-0 [&_button]:flex-1 [&_button]:rounded-[2px] [&_button]:border-dashboard-line [&_button]:bg-dashboard-white [&_button]:font-dashboard-code [&_button]:text-[9px] [&_button]:tracking-[0.06em] [&_button]:text-dashboard-night [&_button]:uppercase [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-dashboard-white">
								<Button onClick={() => void performLogout(logoutState.origin)}>
									<RefreshCw aria-hidden="true" />
									Retry
								</Button>
								{logoutState.origin === "manual" ? (
									<Button
										className="bg-dashboard-ink text-dashboard-white"
										onClick={() => window.location.reload()}
										variant="outline"
									>
										<RotateCcw aria-hidden="true" />
										Return to dashboard
									</Button>
								) : null}
							</div>
						) : null}
					</div>
				</main>
			</LogoutContext.Provider>
		);
	}

	return <LogoutContext.Provider value={contextValue}>{children}</LogoutContext.Provider>;
}
