import Footer from "@/components/footer";
import Header from "@/components/header";
import { SessionActivityController } from "@/components/session-activity-controller";

export type DashboardProps = {
	children: React.ReactNode;
};

export default function DashboardLayout({ children }: Readonly<DashboardProps>) {
	return (
		<div className="flex h-full flex-col bg-primary text-primary-foreground">
			<SessionActivityController />
			<Header />
			<main className="flex-1 overflow-auto p-4 sm:p-8">{children}</main>
			<Footer />
		</div>
	);
}
