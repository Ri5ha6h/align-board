"use client";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useId } from "react";
import MultipleSelector from "@/components/multi-select";
import { Button } from "@/components/ui/button";
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
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const yearOptions = React.useMemo(() => getYearList(), []);
	const [btnLoad, setBtnLoad] = React.useState(false);
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
		setBtnLoad(true);
		if (data.carriers.length === 0) {
			form.setError("carriers", {
				type: "custom",
				message: "Select at least one carrier.",
			});
			setBtnLoad(false);
		} else {
			setTimeout(() => {
				const q = createQueryString(data);
				router.push(`${pathname}?${q}`);
				setBtnLoad(false);
			}, 400);
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
											<p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
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
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl id={`${id}-year`}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a year..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
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
					<div className="mt-5 flex items-center justify-center">
						<Button type="submit" className="w-[120px] capitalize" disabled={btnLoad}>
							{btnLoad ? "Submitting..." : "Submit"}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
