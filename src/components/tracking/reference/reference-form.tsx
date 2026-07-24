"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useId } from "react";

import {
	DashboardFilterActions,
	useDashboardFilterNavigation,
} from "@/components/dashboard/dashboard-filter-actions";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ParamType } from "@/utils/common-types";
import { getCarriersList } from "@/utils/default-data/default-data";
import { useReferenceForm, type ReferenceFormValues } from "@/utils/schema";

export const ReferenceForm = () => {
	const id = useId();
	const params = useParams<ParamType>();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const searchParams = useSearchParams();
	const filterNavigation = useDashboardFilterNavigation();

	const form = useReferenceForm(searchParams);

	const onSubmit = (data: ReferenceFormValues) => {
		//console.log("submit data", data);
		if (!data.carrier) {
			form.setError("carrier", {
				type: "custom",
				message: "Select a carrier",
			});
		} else if (!data.reference) {
			form.setError("reference", {
				type: "custom",
				message: "Input a reference",
			});
		} else {
			filterNavigation.apply(createQueryString(data), () => form.reset(data));
		}
	};

	const createQueryString = React.useCallback(
		(data: ReferenceFormValues) => {
			const refParams = new URLSearchParams(searchParams.toString());

			refParams.set("refCarrier", data.carrier);
			refParams.set("reference", data.reference);

			return refParams.toString();
		},
		[searchParams],
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="dashboard-filter-form grid-cols-1 sm:grid-cols-2"
				>
					<FormField
						control={form.control}
						name="carrier"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-carrier`}>
									{params.mode === "terminal" ? "Terminal" : "Carrier"}
								</FormLabel>
								<Select onValueChange={field.onChange} value={field.value} required>
									<FormControl id={`${id}-carrier`}>
										<SelectTrigger className="w-full">
											<SelectValue
												placeholder={
													params.mode === "terminal"
														? "Select a terminal..."
														: "Select a carrier..."
												}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent className="dashboard-select-content">
										{carriersOptions.map((option) => (
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
						name="reference"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-reference`}>Reference</FormLabel>
								<FormControl id={`${id}-reference`}>
									<Input
										type="text"
										placeholder="Enter reference..."
										required
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<DashboardFilterActions
						canApply={form.formState.isDirty}
						isPending={filterNavigation.isPending}
						onReset={() =>
							filterNavigation.reset(() => form.reset({ carrier: "", reference: "" }))
						}
					/>
				</form>
			</Form>
		</>
	);
};
