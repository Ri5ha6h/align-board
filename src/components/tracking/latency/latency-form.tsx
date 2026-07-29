"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useId } from "react";

import {
	DashboardFilterActions,
	useDashboardFilterNavigation,
} from "@/components/dashboard/dashboard-filter-actions";
import {
	dashboardFilterForm,
	dashboardSelectContent,
} from "@/components/dashboard/dashboard-styles";
import MultipleSelector, { type Option } from "@/components/multi-select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ParamType } from "@/utils/common-types";
import { getCarriersList, getQueueList, getRefList } from "@/utils/default-data/default-data";
import { useLatencyForm, type LatencyFormValues } from "@/utils/schema";

export const LatencyForm = () => {
	const id = useId();
	const params = useParams<ParamType>();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const queueOptions = React.useMemo(() => getQueueList(params.mode), [params.mode]);
	const refOptions = React.useMemo(() => getRefList(params.mode), [params.mode]);
	const searchParams = useSearchParams();
	const filterNavigation = useDashboardFilterNavigation();
	const newCarrOpt = React.useMemo<Option[]>(
		() =>
			(searchParams.get("carriers") ?? "")
				.split(",")
				.filter(Boolean)
				.map((carrier) => ({ label: carrier, value: carrier })),
		[searchParams],
	);

	const form = useLatencyForm(newCarrOpt, searchParams);

	const onSubmit = (data: LatencyFormValues) => {
		filterNavigation.apply(createQueryString(data), () => form.reset(data));
	};

	const createQueryString = React.useCallback(
		(data: LatencyFormValues) => {
			const str = data.carriers.map((carrier) => carrier.value).join(",");
			const latencyParams = new URLSearchParams(searchParams.toString());
			if (str !== "") {
				latencyParams.set("carriers", str);
			} else {
				latencyParams.set("carriers", "");
			}
			latencyParams.set("queue", data.queue);
			latencyParams.set("refType", data.refType);

			return latencyParams.toString();
		},
		[searchParams],
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={`${dashboardFilterForm} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}
				>
					<FormField
						control={form.control}
						name="carriers"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-carriers`}>
									{params.mode === "terminal" ? "Terminals" : "Carriers"}
								</FormLabel>
								<FormControl id={`${id}-carriers`}>
									<MultipleSelector
										value={field.value}
										onChange={field.onChange}
										defaultOptions={carriersOptions}
										placeholder={
											params.mode === "terminal"
												? "Select Terminals you like..."
												: "Select Carriers you like..."
										}
										maxSelected={5}
										emptyIndicator={
											<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
												no results found.
											</p>
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="queue"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-queue`}>Queue</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl id={`${id}-queue`}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a queue..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent className={dashboardSelectContent}>
										{queueOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="refType"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-refType`}>Reference Type</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl id={`${id}-refType`}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a reference type..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent className={dashboardSelectContent}>
										<SelectItem value="ALL">All</SelectItem>
										{refOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<DashboardFilterActions
						canApply={form.formState.isDirty}
						isPending={filterNavigation.isPending}
						onReset={() =>
							filterNavigation.reset(() =>
								form.reset({ carriers: [], queue: "NORMAL", refType: "ALL" }),
							)
						}
					/>
				</form>
			</Form>
		</>
	);
};
