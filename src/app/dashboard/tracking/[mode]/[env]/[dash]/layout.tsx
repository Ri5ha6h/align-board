import { redirect } from "next/navigation";

import {
	dashboardPath,
	isDashboardEnv,
	isDashboardMode,
	isDashboardView,
} from "@/components/dashboard/dashboard-config";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

interface EnvProps {
	children: React.ReactNode;
	params: Promise<{
		mode: string;
		env: string;
		dash: string;
	}>;
}

export default async function DashLayout({ children, params }: EnvProps) {
	const sendParam = await params;
	if (!isDashboardMode(sendParam.mode) || !isDashboardEnv(sendParam.env)) {
		redirect("/dashboard/tracking/ocean/prod/status");
	}
	if (!isDashboardView(sendParam.dash)) {
		redirect(dashboardPath(sendParam.mode, sendParam.env, "status"));
	}
	if (sendParam.dash === "induced" && sendParam.mode !== "ocean") {
		redirect(dashboardPath(sendParam.mode, sendParam.env, "status"));
	}

	return (
		<DashboardShell env={sendParam.env} mode={sendParam.mode} view={sendParam.dash}>
			{children}
		</DashboardShell>
	);
}
