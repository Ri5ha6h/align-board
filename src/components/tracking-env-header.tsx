"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TrackingEnvHeader = ({ params }: { params: { mode: string; env: string; dash: string } }) => {
	const row1 = ["PROD", "DEV"];
	const searchParams = useSearchParams();

	return (
		<>
			<div className="flex flex-col items-center justify-between sm:flex-row sm:justify-around">
				<h2 className="text-xl font-semibold tracking-wider">
					{params.mode?.toUpperCase()} DASHBOARDS
				</h2>
				<div className="flex items-center justify-center">
					<p className="text-lg tracking-wider">ENV </p>
					<Tabs value={params.env}>
						<TabsList className={cn("ml-2 flex h-10 w-[150px] justify-around")}>
							{row1.map((tab) => (
								<Link
									key={tab}
									href={`/dashboard/tracking/${params.mode}/${tab.toLowerCase()}/${
										params.dash
									}?${searchParams.toString()}`}
								>
									<TabsTrigger value={tab.toLowerCase()} className="w-full">
										{tab}
									</TabsTrigger>
								</Link>
							))}
						</TabsList>
					</Tabs>
				</div>
			</div>
		</>
	);
};

export default TrackingEnvHeader;
