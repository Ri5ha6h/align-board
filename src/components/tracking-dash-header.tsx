import { getYear } from "date-fns";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TrackingDashHeader = ({
	params,
}: {
	params: { mode: string; env: string; dash: string };
}) => {
	const tabsRow1 = [
		{
			name: "Status",
			path: `/dashboard/tracking/${params.mode}/${params.env}/status`,
			query: {},
		},
		{
			name: "Summary",
			path: `/dashboard/tracking/${params.mode}/${params.env}/summary`,
			query: {
				carriers: "",
				queue: "NORMAL",
				from: "",
				to: "",
			},
		},
		{
			name: "History",
			path: `/dashboard/tracking/${params.mode}/${params.env}/history`,
			query: {
				subId: "",
				historyType: "DIFF",
				includeRange: "NO",
				from: "",
				to: "",
			},
		},
		{
			name: "References",
			path: `/dashboard/tracking/${params.mode}/${params.env}/references`,
			query: {
				category: "all",
				carrier: "",
				queue: "NORMAL",
				refType:
					params.mode === "ocean"
						? "BOOKING"
						: params.mode === "air"
							? "AWB"
							: params.mode === "road"
								? "LTL"
								: params.mode === "intermodal"
									? "INTMD"
									: params.mode === "freight"
										? "HAWB"
										: params.mode === "load"
											? "LOAD"
											: "IMPORT",
				refStatus: "ACTIVE",
				bucket: "",
			},
		},
		{
			name: "Latency",
			path: `/dashboard/tracking/${params.mode}/${params.env}/latency`,
			query: {
				carriers: "",
				queue: "NORMAL",
				refType: "ALL",
			},
		},
		{
			name: "Induced",
			path: `/dashboard/tracking/${params.mode}/${params.env}/induced`,
			query: {
				carriers: "",
				year: getYear(new Date()).toString(),
			},
		},
	];

	return (
		<>
			<Tabs value={params.dash}>
				<div className="mt-6 w-full space-y-6">
					<TabsList className="flex w-full flex-wrap items-center justify-around">
						{tabsRow1.map((tab) => (
							<Link key={tab.name} href={{ pathname: tab.path, query: tab.query }}>
								<TabsTrigger
									value={tab.name.toLowerCase()}
									className="w-full cursor-pointer"
								>
									{tab.name}
								</TabsTrigger>
							</Link>
						))}
					</TabsList>
				</div>
			</Tabs>
		</>
	);
};

export default TrackingDashHeader;
