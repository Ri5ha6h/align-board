import { DashboardFilter } from "@/components/dashboard/dashboard-filter";

import { SummaryForm } from "./summary-form";
import { SummaryTable } from "./summary-table";

const MainSummaryComponent = ({ isAlignUser }: { isAlignUser: boolean }) => {
	return (
		<div className="flex flex-col">
			<DashboardFilter>
				<SummaryForm isAlignUser={isAlignUser} />
			</DashboardFilter>
			<SummaryTable isAlignUser={isAlignUser} />
		</div>
	);
};

export default MainSummaryComponent;
