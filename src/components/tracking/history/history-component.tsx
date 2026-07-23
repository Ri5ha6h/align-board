import { DashboardFilter } from "@/components/dashboard/dashboard-filter";

import { HistoryForm } from "./history-form";
import { HistoryTable } from "./history-table";

const MainHistoryComponent = () => {
	return (
		<div className="flex flex-col">
			<DashboardFilter>
				<HistoryForm />
			</DashboardFilter>
			<HistoryTable />
		</div>
	);
};

export default MainHistoryComponent;
