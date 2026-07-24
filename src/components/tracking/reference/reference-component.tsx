"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { DashboardFilter } from "@/components/dashboard/dashboard-filter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ParamType } from "@/utils/common-types";

import { ReferenceAllForm } from "./reference-all-form";
import { ReferenceAllTable } from "./reference-all-table";
import { ReferenceForm } from "./reference-form";
import { ReferenceSubscriptionForm } from "./reference-sub-form";
import { ReferenceSubscriptionTable } from "./reference-sub-table";
import { ReferenceTable } from "./reference-table";

export default function MainReferenceComponent() {
	const params = useParams<ParamType>();
	const searchParams = useSearchParams();
	const requestedCategory = searchParams.get("category");
	const tabValue = ["all", "subscription", "reference"].includes(requestedCategory ?? "")
		? (requestedCategory ?? "all")
		: "all";

	const row1 = [
		{
			value: "all",
			name: "All",
			path: `/dashboard/tracking/${params.mode}/${params.env}/references`,
			query: {
				category: "all",
				carrier: "",
				queue: "NORMAL",
				refType:
					params.mode === "ocean"
						? "BOOKING"
						: params.mode === "air"
							? "AWB"
							: params.mode === "road"
								? "LTL"
								: params.mode === "intermodal"
									? "INTMD"
									: params.mode === "freight"
										? "HAWB"
										: params.mode === "load"
											? "LOAD"
											: "IMPORT",
				refStatus: "ACTIVE",
				bucket: "",
			},
		},
		{
			value: "subscription",
			name: "Subscription",
			path: `/dashboard/tracking/${params.mode}/${params.env}/references`,
			query: {
				category: "subscription",
				subscriptionId: "",
			},
		},
		{
			value: "reference",
			name: "Reference",
			path: `/dashboard/tracking/${params.mode}/${params.env}/references`,
			query: {
				category: "reference",
				refCarrier: "",
				reference: "",
			},
		},
	];

	return (
		<Tabs className="w-full" value={tabValue}>
			<TabsList className="dashboard-reference-tabs grid w-full grid-cols-3">
				{row1.map((tab) => (
					<TabsTrigger asChild key={tab.value} value={tab.value}>
						<Link
							className="w-full cursor-pointer"
							href={{ pathname: tab.path, query: tab.query }}
						>
							{tab.name}
						</Link>
					</TabsTrigger>
				))}
			</TabsList>
			<TabsContent value="all">
				<div className="flex flex-col">
					<DashboardFilter>
						<ReferenceAllForm />
					</DashboardFilter>
					<ReferenceAllTable />
				</div>
			</TabsContent>
			<TabsContent value="subscription">
				<div className="flex flex-col">
					<DashboardFilter>
						<ReferenceSubscriptionForm />
					</DashboardFilter>
					<ReferenceSubscriptionTable />
				</div>
			</TabsContent>
			<TabsContent value="reference">
				<div className="flex flex-col">
					<DashboardFilter>
						<ReferenceForm />
					</DashboardFilter>
					<ReferenceTable />
				</div>
			</TabsContent>
		</Tabs>
	);
}
