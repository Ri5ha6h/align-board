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
import type { ParamType, ReferenceSubscriptionFormType } from "@/utils/common-types";
import { getCarriersList } from "@/utils/default-data/default-data";
import { useReferenceSubscriptionForm } from "@/utils/schema";

export const ReferenceSubscriptionForm = () => {
	const id = useId();
	const params = useParams<ParamType>();
	const carriersOptions = React.useMemo(() => getCarriersList(params.mode), [params.mode]);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [btnLoad, setBtnLoad] = React.useState(false);

	const form = useReferenceSubscriptionForm(searchParams);

	const onSubmit = (data: any) => {
		//console.log("submit data", data);
		setBtnLoad(true);
		if (data.subscriptionId) {
			let carrierCheck = data.subscriptionId.split("_")[0];
			if (data.subscriptionId.includes("EXPORT") || data.subscriptionId.includes("IMPORT")) {
				carrierCheck = data.subscriptionId.split("_")[1];
			}

			const isCarrierValid = carriersOptions.some((option) => option.value === carrierCheck);

			if (!isCarrierValid) {
				form.setError("subscriptionId", {
					type: "custom",
					message: "Invalid carrier present in subscription id.",
				});
				setBtnLoad(false);
				return;
			}
		}

		if (data.subscriptionId) {
			setTimeout(() => {
				const q = createQueryString(data);
				router.push(`${pathname}?${q}`);
				setBtnLoad(false);
			}, 400);
		}
	};

	const createQueryString = React.useCallback(
		(data: ReferenceSubscriptionFormType) => {
			const refParams = new URLSearchParams(searchParams.toString());

			refParams.set("subscriptionId", data.subscriptionId);

			return refParams.toString();
		},
		[searchParams],
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-5 grid grid-flow-row auto-rows-auto grid-cols-1 items-center justify-center gap-4 rounded-md border border-gray-200 p-3 sm:grid-cols-2"
				>
					<FormField
						control={form.control}
						name="subscriptionId"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={`${id}-subscriptionId`}>Subscription</FormLabel>
								<FormControl id={`${id}-subscriptionId`}>
									<Input
										type="text"
										placeholder="Enter subscriptionId..."
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
