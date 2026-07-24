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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ParamType } from "@/utils/common-types";
import { getCarriersList, getQueueList, getRefList } from "@/utils/default-data/default-data";
import { useReferenceAllForm, type ReferenceAllFormValues } from "@/utils/schema";

export const ReferenceAllForm = () => {
	const id = useId();
	const params = useParams<ParamType>();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const queueOptions = React.useMemo(() => getQueueList(params.mode), [params.mode]);
	const refOptions = React.useMemo(() => getRefList(params.mode), [params.mode]);
	const searchParams = useSearchParams();
	const filterNavigation = useDashboardFilterNavigation();

	const form = useReferenceAllForm(params, searchParams);

	const onSubmit = (data: ReferenceAllFormValues) => {
		//console.log("submit data", data);
		if (data.carrier.length === 0) {
			form.setError("carrier", {
				type: "custom",
				message: "At least one carrier should be selected.",
			});
		} else {
			filterNavigation.apply(createQueryString(data), () => form.reset(data));
		}
	};

	const createQueryString = React.useCallback(
		(data: ReferenceAllFormValues) => {
			const referenceAllParams = new URLSearchParams(searchParams.toString());
			referenceAllParams.set("carrier", data.carrier);
			if (data.refStatus === "ACTIVE") {
				referenceAllParams.set("queue", data.queue);
				referenceAllParams.set("refType", data.refType);
			} else {
				referenceAllParams.set("queue", "");
				referenceAllParams.set("refType", "");
			}
			referenceAllParams.set("refStatus", data.refStatus);
			referenceAllParams.set("bucket", "");

			return referenceAllParams.toString();
		},
		[searchParams],
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="dashboard-filter-form grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
				>
					<FormField
						control={form.control}
						name="carrier"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-carrier`}>
									{params.mode === "terminal" ? "Terminals" : "Carriers"}
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
						name="refStatus"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-refStatus`}>Status</FormLabel>
								<Select onValueChange={field.onChange} value={field.value} required>
									<FormControl id={`${id}-refStatus`}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a status..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="dashboard-select-content">
										<SelectItem value="ACTIVE">Active</SelectItem>
										<SelectItem value="CLOSED">Closed</SelectItem>
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
								<Select
									onValueChange={field.onChange}
									value={field.value}
									required
									disabled={form.watch("refStatus") === "CLOSED"}
								>
									<FormControl id={`${id}-refType`}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a reference type..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="dashboard-select-content">
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
					<FormField
						control={form.control}
						name="queue"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-queue`}>Queue</FormLabel>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									disabled={form.watch("refStatus") === "CLOSED"}
								>
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
					<DashboardFilterActions
						canApply={form.formState.isDirty}
						isPending={filterNavigation.isPending}
						onReset={() =>
							filterNavigation.reset(() =>
								form.reset({
									carrier: "",
									queue: "NORMAL",
									refType: refOptions[0]?.value ?? "",
									refStatus: "ACTIVE",
								}),
							)
						}
					/>
				</form>
			</Form>
		</>
	);
};
