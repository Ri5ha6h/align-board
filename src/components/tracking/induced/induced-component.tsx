import { DashboardFilter } from "@/components/dashboard/dashboard-filter";

import { InducedChart } from "./induced-chart";
import { InducedForm } from "./induced-form";

const MainInducedComponent = () => {
	return (
		<div className="flex flex-col">
			<DashboardFilter>
				<InducedForm />
			</DashboardFilter>
			<InducedChart />
		</div>
	);
};

export default MainInducedComponent;
