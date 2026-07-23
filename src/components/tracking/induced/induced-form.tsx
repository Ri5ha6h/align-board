"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useId } from "react";

import {
	DashboardFilterActions,
	useDashboardFilterNavigation,
} from "@/components/dashboard/dashboard-filter-actions";
import MultipleSelector from "@/components/multi-select";
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
import type { InducedFormType, ParamType } from "@/utils/common-types";
import { getCarriersList, getYearList } from "@/utils/default-data/default-data";
import { useInducedForm } from "@/utils/schema";

export const InducedForm = () => {
	const id = useId();
	const params = useParams<ParamType>();
	const searchParams = useSearchParams();
	const filterNavigation = useDashboardFilterNavigation();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const yearOptions = React.useMemo(() => getYearList(), []);
	const queryCarriers = React.useMemo(
		() => (searchParams.get("carriers") ? searchParams.get("carriers")?.split(",") : []),
		[searchParams],
	);

	const newCarrOpt: any = [];

	if (queryCarriers !== undefined && queryCarriers.length > 0) {
		queryCarriers.map((carrier) => {
			if (carrier) {
				const carrObj = {
					label: carrier,
					value: carrier,
				};
				newCarrOpt.push(carrObj);
			}
		});
	}

	const form = useInducedForm(newCarrOpt, searchParams);

	const onSubmit = (data: any) => {
		//console.log("submit data", data);
		if (data.carriers.length === 0) {
			form.setError("carriers", {
				type: "custom",
				message: "Select at least one carrier.",
			});
		} else {
			filterNavigation.apply(createQueryString(data));
		}
	};

	const createQueryString = React.useCallback(
		(data: InducedFormType) => {
			let carrStr = "";
			if (data.carriers.length > 0) {
				data.carriers.map((carrier: any, index: number) => {
					if (index === data.carriers.length - 1) {
						carrStr += carrier.value;
					} else {
						carrStr += carrier.value + ",";
					}
				});
			}

			const inducedParams = new URLSearchParams(searchParams.toString());
			if (carrStr !== "") {
				inducedParams.set("carriers", carrStr);
			} else {
				inducedParams.set("carriers", "");
			}

			inducedParams.set("year", data.year);

			return inducedParams.toString();
		},
		[searchParams],
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-5 grid grid-flow-row auto-rows-auto grid-cols-1 items-center justify-center gap-4 rounded-md border border-gray-200 p-3 md:grid-cols-3"
				>
					<FormField
						control={form.control}
						name="carriers"
						render={({ field }) => (
							<FormItem aria-required>
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
										hidePlaceholderWhenSelected
										maxSelected={3}
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
						name="year"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-year`}>Year</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl id={`${id}-year`}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a year..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="dashboard-select-content">
										{yearOptions.map((option) => (
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
								form.reset({
									carriers: [],
									year: new Date().getFullYear().toString(),
								}),
							)
						}
					/>
				</form>
			</Form>
		</>
	);
};
