"use client";

import { useParams, useSearchParams } from "next/navigation";
import * as React from "react";

import { DashboardTableSkeleton } from "@/components/dashboard/dashboard-loading";
import {
	DashboardWaitingState,
	useDashboardQueryReport,
} from "@/components/dashboard/dashboard-runtime";
import ChartComponent, { type ChartDatum } from "@/components/data-chart";
import type { ParamType } from "@/utils/common-types";
import { getYearList } from "@/utils/default-data/default-data";
import { useInducedQuery } from "@/utils/query";

interface InducedDataProps {
	carriers: string[];
	params: ParamType;
	year: string;
}

export function InducedChart() {
	const params = useParams<ParamType>();
	const searchParams = useSearchParams();
	const carriers = React.useMemo(
		() => (searchParams.get("carriers") ?? "").split(",").filter(Boolean),
		[searchParams],
	);

	if (carriers.length === 0) {
		return <DashboardWaitingState>Select a carrier to view chart.</DashboardWaitingState>;
	}

	return (
		<InducedData
			carriers={carriers}
			params={params}
			year={searchParams.get("year") ?? getYearList()[0]?.value ?? ""}
		/>
	);
}

function InducedData({ carriers, params, year }: InducedDataProps) {
	const inducedQuery = useInducedQuery(params, carriers, year);
	useDashboardQueryReport({
		data: inducedQuery.data,
		error: inducedQuery.error,
		isFetching: inducedQuery.isFetching,
		isPending: inducedQuery.isPending,
		success: inducedQuery.data?.success,
	});

	if (inducedQuery.isPending) return <DashboardTableSkeleton />;

	if (inducedQuery.isError || inducedQuery.error) {
		return (
			<div className="mt-6 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">Error: {inducedQuery.error?.message}</p>
			</div>
		);
	}

	if (inducedQuery.data && !inducedQuery.data.success) {
		return (
			<div className="mt-10 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">{String(inducedQuery.data.data)}</p>
			</div>
		);
	}

	const data = (inducedQuery.data?.data ?? []) as ChartDatum[];
	return <ChartComponent carriers={carriers} chartData={data} />;
}
