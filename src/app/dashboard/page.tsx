import {
	ContainerIcon,
	FileUpIcon,
	MoveRightIcon,
	PlaneIcon,
	ShipIcon,
	TrainFrontIcon,
	TruckIcon,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
	const modeList = [
		{
			mode: "ocean",
			env: "prod",
		},
		{
			mode: "air",
			env: "prod",
		},
		{
			mode: "terminal",
			env: "prod",
		},
		{
			mode: "road",
			env: "prod",
		},
		{
			mode: "intermodal",
			env: "prod",
		},
		{
			mode: "freight",
			env: "prod",
		},
		{
			mode: "load",
			env: "prod",
		},
	];
	return (
		<div className="flex h-full flex-col items-center justify-center px-3 sm:px-6">
			<Card className="w-full sm:w-[525px]">
				<CardHeader className="border-b">
					<CardTitle>Tracking</CardTitle>
					<CardDescription>To view data insights/metrics.</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2">
					{modeList.map((item) => (
						<Link
							key={item.mode}
							href={`/dashboard/tracking/${item.mode}/${item.env}/status`}
						>
							<div className="flex items-center justify-between rounded-full border p-4 hover:bg-primary hover:text-primary-foreground">
								<div className="flex items-center">
									{item.mode === "ocean" ? (
										<ShipIcon className="text-xl" />
									) : item.mode === "air" ? (
										<PlaneIcon className="text-xl" />
									) : item.mode === "road" ? (
										<TruckIcon className="text-xl" />
									) : item.mode === "intermodal" ? (
										<TrainFrontIcon className="text-xl" />
									) : item.mode === "load" ? (
										<FileUpIcon className="text-xl" />
									) : item.mode === "freight" ? (
										<PlaneIcon className="text-xl" />
									) : (
										<ContainerIcon className="text-xl" />
									)}
									<p className="ml-2 text-lg">{item.mode.toUpperCase()}</p>
								</div>
								<MoveRightIcon className="font-bold text-2xl" />
							</div>
						</Link>
					))}
				</CardContent>
			</Card>
		</div>
	);
};

export default Dashboard;
