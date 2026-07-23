"use client";

import { useParams, useSearchParams } from "next/navigation";
import * as React from "react";

import { DashboardTableSkeleton } from "@/components/dashboard/dashboard-loading";
import {
	DashboardWaitingState,
	useDashboardQueryReport,
} from "@/components/dashboard/dashboard-runtime";
import ChartComponent from "@/components/data-chart";
import type { ParamType } from "@/utils/common-types";
import { useInducedQuery } from "@/utils/query";

export function InducedChart() {
	const params = useParams<ParamType>();
	const searchParams = useSearchParams();

	const queryCarriers = React.useMemo(
		() => (searchParams.get("carriers") ? searchParams.get("carriers")?.split(",") : []),
		[searchParams],
	);

	const newCarrOpt: string[] = [];

	if (queryCarriers !== undefined && queryCarriers.length > 0) {
		queryCarriers.map((carrier) => {
			if (carrier) {
				newCarrOpt.push(carrier);
			}
		});
	}

	if (!searchParams.get("carriers")) {
		return <DashboardWaitingState>Select a carrier to view chart.</DashboardWaitingState>;
	}

	return <InducedData params={params} carriers={newCarrOpt} year={searchParams.get("year")} />;
}

const InducedData = ({ ...props }) => {
	const inducedQuery = useInducedQuery(props.params, props.carriers, props.year);
	useDashboardQueryReport({
		data: inducedQuery.data,
		error: inducedQuery.error,
		isFetching: inducedQuery.isFetching,
		isPending: inducedQuery.isPending,
		success: inducedQuery.data?.success,
	});

	if (inducedQuery.isPending) {
		return <DashboardTableSkeleton />;
	}

	if (inducedQuery.isError || inducedQuery.error) {
		return (
			<div className="mt-6 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">Error: {inducedQuery.error?.message}</p>
			</div>
		);
	}

	if (inducedQuery.data && !inducedQuery.data?.success) {
		return (
			<div className="mt-10 flex h-full flex-col items-center justify-center">
				<p className="text-red-500">{inducedQuery.data?.data}</p>
			</div>
		);
	}

	return <ChartDataTwo data={inducedQuery.data} carriers={props.carriers} />;
};

const ChartDataTwo = ({ ...props }) => {
	return <ChartComponent chartData={props.data?.data} carriers={props.carriers} />;
};
