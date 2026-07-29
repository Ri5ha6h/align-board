"use client";

import { Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";

import { dashboardSelectContent, dashboardShimmer } from "@/components/dashboard/dashboard-styles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const SERIES_STYLES = [
	{ color: "#fafafa", dash: undefined },
	{ color: "#d4d4d8", dash: "8 4" },
	{ color: "#a1a1aa", dash: "2 4" },
] as const;

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
	timeZone: "UTC",
});

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
	timeZone: "UTC",
	year: "numeric",
});

export type ChartDatum = { date: string } & Record<string, string | number | null | undefined>;

interface ChartComponentProps {
	carriers: string[];
	chartData: ChartDatum[];
}

interface ChartCanvasProps {
	carriers: string[];
	filteredData: ChartDatum[];
	focusedCarrier: string | null;
	hiddenCarriers: ReadonlySet<string>;
}

function formatChartDate(value: unknown, formatter: Intl.DateTimeFormat) {
	const date = new Date(String(value));
	return Number.isNaN(date.getTime()) ? "Unknown date" : formatter.format(date);
}

const ChartCanvas = dynamic<ChartCanvasProps>(
	() =>
		import("recharts").then(
			({ CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis }) => {
				return function InducedLatencyChart({
					carriers,
					filteredData,
					focusedCarrier,
					hiddenCarriers,
				}: ChartCanvasProps) {
					return (
						<figure
							aria-label="Induced latency trends by carrier"
							className="aspect-auto h-[280px] w-full"
						>
							<ResponsiveContainer height="100%" width="100%">
								<LineChart
									accessibilityLayer
									data={filteredData}
									margin={{ left: 12, right: 12 }}
								>
									<CartesianGrid stroke="#444449" vertical={false} />
									<XAxis
										axisLine={false}
										dataKey="date"
										stroke="#a1a1aa"
										tickFormatter={(value) =>
											formatChartDate(value, SHORT_DATE_FORMATTER)
										}
										tickLine={false}
									/>
									<YAxis
										axisLine={false}
										stroke="#a1a1aa"
										tickFormatter={(value) => `${value}h`}
										tickLine={false}
									/>
									<Tooltip
										content={({ active, label, payload }) =>
											active && payload?.length ? (
												<div className="grid w-[210px] gap-2 rounded-[2px] border border-dashboard-line bg-dashboard-ink p-3 text-dashboard-white shadow-[0_12px_28px_rgba(0,0,0,0.45)]">
													<strong>
														{formatChartDate(
															label,
															LONG_DATE_FORMATTER,
														)}
													</strong>
													{payload.map((item) => (
														<div
															className="grid w-full grid-cols-[8px_minmax(0,1fr)_auto] items-center gap-2 font-dashboard-code text-[10px] text-dashboard-mist [&_strong]:text-[11px] [&_strong]:text-dashboard-white [&_strong]:[font-variant-numeric:tabular-nums]"
															key={String(item.dataKey ?? item.name)}
														>
															<span
																aria-hidden="true"
																className="size-2 rounded-full"
																style={{
																	backgroundColor: item.color,
																}}
															/>
															<span>{String(item.name)}</span>
															<strong>
																{Number(item.value).toLocaleString(
																	"en-US",
																)}{" "}
																h
															</strong>
														</div>
													))}
												</div>
											) : null
										}
									/>
									{carriers.map((carrier, index) => {
										if (hiddenCarriers.has(carrier)) return null;
										const style = SERIES_STYLES[index % SERIES_STYLES.length];
										const isDimmed =
											focusedCarrier !== null && focusedCarrier !== carrier;
										return (
											<Line
												activeDot={{
													r: 5,
													stroke: "#202023",
													strokeWidth: 2,
												}}
												dataKey={carrier}
												dot={{
													fill: "#202023",
													r: 3,
													stroke: style.color,
													strokeWidth: 2,
												}}
												isAnimationActive={false}
												key={carrier}
												opacity={isDimmed ? 0.22 : 1}
												stroke={style.color}
												strokeDasharray={style.dash}
												strokeLinecap="round"
												strokeWidth={focusedCarrier === carrier ? 3.5 : 2.5}
												type="monotone"
											/>
										);
									})}
								</LineChart>
							</ResponsiveContainer>
						</figure>
					);
				};
			},
		),
	{
		loading: () => <div className={`${dashboardShimmer} h-[280px] w-full`} />,
		ssr: false,
	},
);

export default function ChartComponent({ carriers, chartData }: ChartComponentProps) {
	const [timeRange, setTimeRange] = React.useState("7d");
	const [hiddenCarriers, setHiddenCarriers] = React.useState<ReadonlySet<string>>(
		() => new Set(),
	);
	const [focusedCarrier, setFocusedCarrier] = React.useState<string | null>(null);

	const filteredData = React.useMemo(() => {
		if (timeRange === "all") return Array.isArray(chartData) ? chartData : [];
		const days =
			timeRange === "90d" ? 90 : timeRange === "60d" ? 60 : timeRange === "30d" ? 30 : 7;
		const threshold = new Date();
		threshold.setUTCHours(0, 0, 0, 0);
		threshold.setUTCDate(threshold.getUTCDate() - days);
		return (Array.isArray(chartData) ? chartData : []).filter((item) => {
			const date = new Date(item.date);
			return !Number.isNaN(date.getTime()) && date >= threshold;
		});
	}, [chartData, timeRange]);

	const toggleCarrier = (carrier: string) => {
		setHiddenCarriers((current) => {
			const next = new Set(current);
			if (next.has(carrier)) next.delete(carrier);
			else next.add(carrier);
			return next;
		});
	};

	return (
		<Card className="mt-5 gap-0 rounded-[2px] border-dashboard-line bg-dashboard-night py-0 text-dashboard-white shadow-none">
			<CardHeader className="flex items-center gap-2 space-y-0 border-b border-dashboard-line bg-dashboard-ink py-5 sm:flex-row [&_[data-slot=card-description]]:text-dashboard-mist">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle className="text-xl">Latency Trend</CardTitle>
					<CardDescription>Daily induced latency, shown in hours.</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger aria-label="Chart time range" className="w-[160px] sm:ml-auto">
						<SelectValue placeholder="Last 7 days" />
					</SelectTrigger>
					<SelectContent className={dashboardSelectContent}>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="90d">Last 3 months</SelectItem>
						<SelectItem value="60d">Last 2 months</SelectItem>
						<SelectItem value="30d">Last 30 days</SelectItem>
						<SelectItem value="7d">Last 7 days</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="p-4">
				<ChartCanvas
					carriers={carriers}
					filteredData={filteredData}
					focusedCarrier={focusedCarrier}
					hiddenCarriers={hiddenCarriers}
				/>
				<div
					aria-label="Toggle chart series"
					className="flex flex-wrap gap-2 border-t border-dashboard-line pt-3.5"
				>
					{carriers.map((carrier, index) => {
						const isHidden = hiddenCarriers.has(carrier);
						const style = SERIES_STYLES[index % SERIES_STYLES.length];
						return (
							<button
								aria-pressed={!isHidden}
								className="inline-flex min-h-[34px] items-center gap-2 rounded-[2px] border border-dashboard-line bg-dashboard-night px-2.5 py-[7px] font-dashboard-code text-[10px] text-dashboard-white hover:border-dashboard-mist hover:bg-dashboard-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-white data-[hidden=true]:text-dashboard-mist data-[hidden=true]:line-through data-[hidden=true]:opacity-70 [&_svg]:size-[13px]"
								data-hidden={isHidden}
								key={carrier}
								onBlur={() => setFocusedCarrier(null)}
								onClick={() => toggleCarrier(carrier)}
								onFocus={() => setFocusedCarrier(carrier)}
								onMouseEnter={() => setFocusedCarrier(carrier)}
								onMouseLeave={() => setFocusedCarrier(null)}
								type="button"
							>
								<span
									aria-hidden="true"
									className="w-5 border-t-2"
									style={{
										borderColor: style.color,
										borderStyle: style.dash ? "dashed" : "solid",
									}}
								/>
								<span>{carrier}</span>
								{isHidden ? (
									<EyeOff aria-hidden="true" />
								) : (
									<Eye aria-hidden="true" />
								)}
							</button>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
