import { DM_Mono, Manrope } from "next/font/google";

import { SessionActivityController } from "@/components/session-activity-controller";

export type DashboardProps = {
	children: React.ReactNode;
};

const manrope = Manrope({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-dashboard-sans",
	weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-dashboard-mono",
	weight: ["400", "500"],
});

export default function DashboardLayout({ children }: Readonly<DashboardProps>) {
	return (
		<div className={`${manrope.variable} ${dmMono.variable} h-full`}>
			<SessionActivityController />
			{children}
		</div>
	);
}
