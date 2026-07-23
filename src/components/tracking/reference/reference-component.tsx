"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

import { DashboardFilter } from "@/components/dashboard/dashboard-filter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ReferenceAllForm } from "./reference-all-form";
import { ReferenceAllTable } from "./reference-all-table";
import { ReferenceForm } from "./reference-form";
import { ReferenceSubscriptionForm } from "./reference-sub-form";
import { ReferenceSubscriptionTable } from "./reference-sub-table";
import { ReferenceTable } from "./reference-table";

export default function MainReferenceComponent() {
	const params = useParams();
	const searchParams = useSearchParams();
	const [tabVal, setTabVal] = React.useState(searchParams.get("category") || "all");

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
		<Tabs
			className="w-full"
			value={tabVal}
			onValueChange={(value) => {
				setTabVal(value);
			}}
		>
			<TabsList className="grid w-full grid-cols-3">
				{row1.map((tab) => (
					<Link key={tab.value} href={{ pathname: tab.path, query: tab.query }}>
						<TabsTrigger value={tab.value} className="w-full cursor-pointer">
							{tab.name}
						</TabsTrigger>
					</Link>
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
