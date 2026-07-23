import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const chartConfig = {
	date: {
		label: "date",
	},
} satisfies ChartConfig;

const SERIES_STYLES = [
	{ color: "#fafafa", dash: undefined },
	{ color: "#a1a1aa", dash: "7 4" },
	{ color: "#71717a", dash: "2 4" },
] as const;

type ChartDatum = { date: string } & Record<string, string | number | null | undefined>;

export default function ChartComponent({
	chartData,
	carriers,
}: {
	chartData: ChartDatum[];
	carriers: string[];
}) {
	const [timeRange, setTimeRange] = React.useState("7d");

	const filteredData = (Array.isArray(chartData) ? chartData : []).filter((item) => {
		const date = new Date(item.date);
		const now = new Date();
		let daysToSubtract = 7;
		if (timeRange === "90d") {
			daysToSubtract = 90;
		} else if (timeRange === "60d") {
			daysToSubtract = 60;
		} else if (timeRange === "30d") {
			daysToSubtract = 30;
		} else if (timeRange === "all") {
			return true;
		}

		now.setDate(now.getDate() - daysToSubtract);
		const now2 = now.toISOString().split("T")[0];
		const newDate = new Date(now2);
		return date >= newDate;
	});

	const updatedCarrierList = React.useMemo(
		() =>
			carriers.map((carrier, index) => ({
				carrier,
				...SERIES_STYLES[index % SERIES_STYLES.length],
				hide: false,
			})),
		[carriers],
	);
	const [hidden, setHidden] = React.useState(updatedCarrierList);

	React.useEffect(() => {
		setHidden(updatedCarrierList);
	}, [updatedCarrierList]);

	return (
		<Card className="dashboard-chart-card mt-5">
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle className="text-xl">Latency Trend</CardTitle>
					<CardDescription>Showing latency in hours for each day.</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger className="w-[160px] sm:ml-auto" aria-label="Chart time range">
						<SelectValue placeholder="Last 3 months" />
					</SelectTrigger>
					<SelectContent className="dashboard-select-content">
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="90d">Last 3 months</SelectItem>
						<SelectItem value="60d">Last 2 months</SelectItem>
						<SelectItem value="30d">Last 30 days</SelectItem>
						<SelectItem value="7d">Last 7 days</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="p-4">
				<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
					<LineChart
						accessibilityLayer
						data={filteredData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid stroke="#444449" vertical={false} />
						<XAxis
							dataKey="date"
							stroke="#a1a1aa"
							tickLine={false}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>

						<YAxis
							axisLine={false}
							stroke="#a1a1aa"
							tickLine={false}
							ticks={[0, 4, 8, 12, 16, 20]}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="dashboard-chart-tooltip w-[180px]"
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										});
									}}
								/>
							}
						/>
						<ChartLegend
							onClick={({ dataKey }) => {
								const k = dataKey?.toString();
								const newHidden = hidden.map((item: any) => {
									if (item?.carrier === k) {
										return { ...item, hide: !item?.hide };
									}
									return item;
								});
								setHidden(newHidden);
							}}
						/>

						{hidden.map((item: any) => {
							return (
								<Line
									type="monotone"
									dataKey={item?.carrier}
									stroke={item?.color}
									strokeDasharray={item?.dash}
									strokeWidth={2}
									dot={{ fill: "#202023", r: 3, strokeWidth: 1.5 }}
									key={item?.carrier}
									hide={item?.hide}
								/>
							);
						})}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
