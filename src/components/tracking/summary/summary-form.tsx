"use client";

import { format, startOfDay, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useId } from "react";
import MultipleSelector from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ParamType } from "@/utils/common-types";
import { getCarriersList, getQueueList } from "@/utils/default-data/default-data";
import { useSummaryForm } from "@/utils/schema";

type SummaryCarrierOption = {
	label: string;
	value: string;
};

type SummaryFormValues = {
	carriers: SummaryCarrierOption[];
	queue: string;
	range?: {
		from: Date;
		to: Date;
	};
};

export const SummaryForm = ({ isJTUser }: { isJTUser: boolean }) => {
	const id = useId();
	const params = useParams<ParamType>();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const queueOptions = React.useMemo(() => getQueueList(params.mode), [params.mode]);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [btnLoad, setBtnLoad] = React.useState(false);
	const queryCarriers = React.useMemo(
		() => (searchParams.get("carriers") ? searchParams.get("carriers")?.split(",") : []),
		[searchParams],
	);
	const newCarrOpt: SummaryCarrierOption[] = [];

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

	const form = useSummaryForm(newCarrOpt, searchParams);

	const onSubmit = (data: SummaryFormValues) => {
		setBtnLoad(true);
		if (
			isJTUser &&
			data.carriers.length === 1 &&
			(!data.range || !data.range.from || !data.range.to)
		) {
			form.setError("range", {
				type: "custom",
				message: "Start date and End date are required.",
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
		(data: SummaryFormValues) => {
			let str = "";
			if (data.carriers.length > 0) {
				data.carriers.map((carrier: SummaryCarrierOption, index: number) => {
					if (index === data.carriers.length - 1) {
						str += carrier.value;
					} else {
						str += `${carrier.value},`;
					}
				});
			}
			const summaryParams = new URLSearchParams(searchParams.toString());
			if (str !== "") {
				summaryParams.set("carriers", str);
			} else {
				summaryParams.set("carriers", "");
			}
			summaryParams.set("queue", data.queue);
			if (isJTUser && data.carriers.length === 1 && data.range) {
				summaryParams.set("from", format(data.range.from, "yyyy-MM-dd"));
				summaryParams.set("to", format(data.range.to, "yyyy-MM-dd"));
			} else {
				summaryParams.set("from", "");
				summaryParams.set("to", "");
			}

			return summaryParams.toString();
		},
		[searchParams, isJTUser],
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-5 grid grid-flow-row auto-rows-auto grid-cols-1 items-center justify-center gap-4 rounded-md border border-gray-200 p-3 sm:grid-cols-2 lg:grid-cols-4"
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
										hidePlaceholderWhenSelected
										maxSelected={5}
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
						name="queue"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-queue`}>Queue</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl id={`${id}-queue`}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a queue..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
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
					{isJTUser ? (
						<FormField
							control={form.control}
							name="range"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor={`${id}-dateRange`}>Range</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl id={`${id}-dateRange`}>
												<Button
													type="button"
													id={`${id}-date`}
													variant={"outline"}
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
													disabled={
														!(form.watch("carriers").length === 1)
													}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value?.from ? (
														field.value?.to ? (
															<>
																{format(
																	field.value.from,
																	"LLL dd, y",
																)}
																{" - "}
																{format(
																	field.value.to,
																	"LLL dd, y",
																)}
															</>
														) : (
															format(field.value.from, "LLL dd, y")
														)
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="range"
												max={45}
												min={1}
												defaultMonth={field.value?.from}
												selected={field.value}
												onSelect={field.onChange}
												numberOfMonths={1}
												disabled={{
													before: startOfDay(subDays(new Date(), 44)),
													after: new Date(),
												}}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					) : null}
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
