import TrackingDashHeader from "@/components/tracking-dash-header";
import TrackingEnvHeader from "@/components/tracking-env-header";
import { cn } from "@/lib/utils";

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
	return (
		<div className={cn("flex h-full flex-col")}>
			<TrackingEnvHeader params={sendParam} />
			<TrackingDashHeader params={sendParam} />
			<div className={cn("flex-1 py-10")}>{children}</div>
		</div>
	);
}
