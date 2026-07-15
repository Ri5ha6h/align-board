"use client";

import { format, millisecondsToHours, startOfDay, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useId } from "react";
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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { HistoryFormType, ParamType } from "@/utils/common-types";
import { getCarriersList, getHistoryType } from "@/utils/default-data/default-data";
import { useHistoryForm } from "@/utils/schema";

export const HistoryForm = () => {
	const id = useId();
	const params = useParams<ParamType>();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const historyOptions = getHistoryType();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [btnLoad, setBtnLoad] = React.useState(false);

	const form = useHistoryForm(searchParams);

	const onSubmit = (data: any) => {
		//console.log("submit data", data);
		setBtnLoad(true);
		if (!data.range || !data.range.from || !data.range.to) {
			form.setError("range", {
				type: "custom",
				message: "Start date and End date are required.",
			});
			setBtnLoad(false);
			return;
		}

		if (data.subId) {
			let carrierCheck = data.subId.split("_")[0];
			if (data.subId.includes("EXPORT") || data.subId.includes("IMPORT")) {
				carrierCheck = data.subId.split("_")[1];
			}

			const isCarrierValid = carriersOptions.some((option) => option.value === carrierCheck);

			if (!isCarrierValid) {
				form.setError("subId", {
					type: "custom",
					message: "Invalid carrier present in subscription id.",
				});
				setBtnLoad(false);
				return;
			}
		}

		const subTract = data.range.to - data.range.from;

		if (millisecondsToHours(subTract) > 360) {
			form.setError("range", {
				type: "custom",
				message: "Date range should be less than or equal to 15 days.",
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
		(data: HistoryFormType) => {
			const historyParams = new URLSearchParams(searchParams.toString());
			historyParams.set("subId", data.subId);
			historyParams.set("historyType", data.historyType);
			historyParams.set("includeRange", data.includeRange);
			if (data.subId.length > 1 && data.includeRange === "YES") {
				historyParams.set("from", format(data.range.from, "yyyy-MM-dd"));
				historyParams.set("to", format(data.range.to, "yyyy-MM-dd"));
			} else {
				historyParams.set("from", "");
				historyParams.set("to", "");
			}

			return historyParams.toString();
		},
		[searchParams],
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn(
						"mt-5 grid grid-flow-row auto-rows-auto grid-cols-1 items-center justify-center gap-4 rounded-md border border-gray-200 p-3 sm:grid-cols-2",
						form.watch("includeRange") === "YES" ? "md:grid-cols-3" : "md:grid-cols-4",
					)}
				>
					<FormField
						control={form.control}
						name="subId"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-subId`}>Subscription</FormLabel>
								<FormControl id={`${id}-subId`}>
									<Input
										type="text"
										required
										placeholder="Enter subscription id..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="historyType"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-historyType`}>Crawl Status</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl id={`${id}-historyType`}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a history type..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{historyOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label} HISTORY
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					{form.watch().historyType === "ALL" && (
						<FormField
							control={form.control}
							name="includeRange"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor={`${id}-includeRange`}>
										Include Range
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl id={`${id}-includeRange`}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Does range needed..." />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="NO">No</SelectItem>
											<SelectItem value="YES">Yes</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{form.watch("includeRange") === "YES" && (
						<FormField
							control={form.control}
							name="range"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor={`${id}-range`}>Range</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl id={`${id}-range`}>
												<Button
													id={`${id}-date`}
													variant={"outline"}
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
													disabled={!form.watch("subId").length}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value?.from ? (
														field.value?.to ? (
															<>
																{format(
																	field.value.from,
																	"LLL dd, y",
																)}{" "}
																-{" "}
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
												max={90}
												min={1}
												defaultMonth={field.value?.from}
												selected={field.value}
												onSelect={field.onChange}
												numberOfMonths={1}
												disabled={{
													before: startOfDay(subDays(new Date(), 89)),
													after: new Date(),
												}}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
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
