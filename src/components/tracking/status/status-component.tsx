"use client";

import React from "react";
import { StatusAccordion } from "@/components/accord-util";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusTable } from "./status-table";

const disabledActionClassName =
	"disabled:pointer-events-auto disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-100";

const MainStatusComponent = ({ isAlignUser }: { isAlignUser: boolean }) => {
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
					{isAlignUser ? (
						<>
							{/* Status creation is temporarily disabled.
							<CreateEditStatusDrawer
								variant="secondary"
								buttonTitle="New Status"
								title="Add a new status"
								state="CREATE"
								tableType={tabVal.toUpperCase()}
							/>
							*/}
							<Button
								type="button"
								variant="secondary"
								disabled
								className={disabledActionClassName}
							>
								New Status
							</Button>
						</>
					) : null}
				</div>
				<TabsContent
					value="active"
					className="mt-6 mb-6 flex-1 rounded-md bg-white p-4 text-primary"
				>
					<StatusTable type="active" isAlignUser={isAlignUser} />
				</TabsContent>
				<TabsContent
					value="closed"
					className="mt-6 mb-6 flex-1 rounded-md bg-white p-4 text-primary"
				>
					<StatusTable type="closed" isAlignUser={isAlignUser} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default MainStatusComponent;
