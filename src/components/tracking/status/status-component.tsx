"use client";

import React from "react";
import { StatusAccordion } from "@/components/accord-util";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateEditStatusDrawer } from "./create-edit-drawer";
import { StatusTable } from "./status-table";

const MainStatusComponent = ({ isJTUser }: { isJTUser: boolean }) => {
	const [tabVal, setTabVal] = React.useState("active");
	return (
		<div className="w-full">
			<div className="rounded-md bg-white p-4">
				<StatusAccordion />
			</div>
			<Tabs
				value={tabVal}
				onValueChange={(value) => {
					setTabVal(value);
				}}
				className="mt-4 flex h-full flex-col"
			>
				<div className="flex items-center justify-between">
					<TabsList>
						<TabsTrigger value="active">Current Status</TabsTrigger>
						<TabsTrigger value="closed">Status History</TabsTrigger>
					</TabsList>
					{isJTUser ? (
						<CreateEditStatusDrawer
							variant="secondary"
							buttonTitle="New Status"
							title="Add a new status"
							state="CREATE"
							tableType={tabVal.toUpperCase()}
						/>
					) : null}
				</div>
				<TabsContent
					value="active"
					className="mt-6 mb-6 flex-1 rounded-md bg-white p-4 text-primary"
				>
					<StatusTable type="active" isJTUser={isJTUser} />
				</TabsContent>
				<TabsContent
					value="closed"
					className="mt-6 mb-6 flex-1 rounded-md bg-white p-4 text-primary"
				>
					<StatusTable type="closed" isJTUser={isJTUser} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default MainStatusComponent;
