"use client";

import { format, startOfDay, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import React, { useId } from "react";

import {
	DashboardFilterActions,
	useDashboardFilterNavigation,
} from "@/components/dashboard/dashboard-filter-actions";
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

export const SummaryForm = ({ isAlignUser }: { isAlignUser: boolean }) => {
	const id = useId();
	const [calendarToday, setCalendarToday] = React.useState<Date | null>(null);
	const params = useParams<ParamType>();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const queueOptions = React.useMemo(() => getQueueList(params.mode), [params.mode]);
	const searchParams = useSearchParams();
	const filterNavigation = useDashboardFilterNavigation();
	React.useEffect(() => setCalendarToday(new Date()), []);
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
		if (
			isAlignUser &&
			data.carriers.length === 1 &&
			(!data.range || !data.range.from || !data.range.to)
		) {
			form.setError("range", {
				type: "custom",
				message: "Start date and End date are required.",
			});
		} else {
			filterNavigation.apply(createQueryString(data), () => form.reset(data));
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
			if (isAlignUser && data.carriers.length === 1 && data.range) {
				summaryParams.set("from", format(data.range.from, "yyyy-MM-dd"));
				summaryParams.set("to", format(data.range.to, "yyyy-MM-dd"));
			} else {
				summaryParams.set("from", "");
				summaryParams.set("to", "");
			}

			return summaryParams.toString();
		},
		[searchParams, isAlignUser],
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="dashboard-filter-form grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
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
									<SelectContent className="dashboard-select-content">
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
					{isAlignUser ? (
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
										<PopoverContent
											className="dashboard-popover w-auto p-0"
											align="start"
										>
											<Calendar
												mode="range"
												max={45}
												min={1}
												defaultMonth={field.value?.from}
												selected={field.value}
												onSelect={field.onChange}
												numberOfMonths={1}
												disabled={
													calendarToday
														? {
																before: startOfDay(
																	subDays(calendarToday, 44),
																),
																after: calendarToday,
															}
														: undefined
												}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					) : null}
					<DashboardFilterActions
						canApply={form.formState.isDirty}
						isPending={filterNavigation.isPending}
						onReset={() =>
							filterNavigation.reset(() =>
								form.reset({
									carriers: [],
									queue: "NORMAL",
									range: {
										from: subDays(new Date(), 1),
										to: new Date(),
									},
								}),
							)
						}
					/>
				</form>
			</Form>
		</>
	);
};
