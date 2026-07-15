"use client";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useId } from "react";
import { Button } from "@/components/ui/button";
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
import type { ParamType, ReferenceFormType } from "@/utils/common-types";
import { getCarriersList } from "@/utils/default-data/default-data";
import { useReferenceForm } from "@/utils/schema";

export const ReferenceForm = () => {
	const id = useId();
	const params = useParams<ParamType>();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [btnLoad, setBtnLoad] = React.useState(false);

	const form = useReferenceForm(searchParams);

	const onSubmit = (data: any) => {
		//console.log("submit data", data);
		setBtnLoad(true);
		if (!data.carrier) {
			form.setError("carrier", {
				type: "custom",
				message: "Select a carrier",
			});
			setBtnLoad(false);
		} else if (!data.reference) {
			form.setError("reference", {
				type: "custom",
				message: "Input a reference",
			});
			setBtnLoad(false);
		} else {
			setTimeout(() => {
				const q = createQueryString(data);
				router.push(pathname + "?" + q);
				setBtnLoad(false);
			}, 400);
		}
	};

	const createQueryString = React.useCallback(
		(data: ReferenceFormType) => {
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
					className="mt-5 grid grid-flow-row auto-rows-auto grid-cols-1 items-center justify-center gap-4 rounded-md border border-gray-200 p-3 sm:grid-cols-2 md:grid-cols-3"
				>
					<FormField
						control={form.control}
						name="carrier"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-carrier`}>
									{params.mode === "terminal" ? "Terminal" : "Carrier"}
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									required
								>
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
									<SelectContent>
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
