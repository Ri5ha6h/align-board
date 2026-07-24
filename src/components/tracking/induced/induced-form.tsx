"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useId } from "react";

import {
	DashboardFilterActions,
	useDashboardFilterNavigation,
} from "@/components/dashboard/dashboard-filter-actions";
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
import { getCarriersList, getYearList } from "@/utils/default-data/default-data";
import { useInducedForm, type InducedFormValues } from "@/utils/schema";

export const InducedForm = () => {
	const id = useId();
	const params = useParams<ParamType>();
	const searchParams = useSearchParams();
	const filterNavigation = useDashboardFilterNavigation();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const yearOptions = React.useMemo(() => getYearList(), []);
	const newCarrOpt = React.useMemo<Option[]>(
		() =>
			(searchParams.get("carriers") ?? "")
				.split(",")
				.filter(Boolean)
				.map((carrier) => ({ label: carrier, value: carrier })),
		[searchParams],
	);

	const form = useInducedForm(newCarrOpt, searchParams);

	const onSubmit = (data: InducedFormValues) => {
		//console.log("submit data", data);
		if (data.carriers.length === 0) {
			form.setError("carriers", {
				type: "custom",
				message: "Select at least one carrier.",
			});
		} else {
			filterNavigation.apply(createQueryString(data), () => form.reset(data));
		}
	};

	const createQueryString = React.useCallback(
		(data: InducedFormValues) => {
			const carrStr = data.carriers.map((carrier) => carrier.value).join(",");

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
					className="dashboard-filter-form grid-cols-1 md:grid-cols-2"
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
