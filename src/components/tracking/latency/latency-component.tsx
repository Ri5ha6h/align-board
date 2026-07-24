import { DashboardFilter } from "@/components/dashboard/dashboard-filter";

import { LatencyForm } from "./latency-form";
import { LatencyTable } from "./latency-table";

const MainLatencyComponent = () => {
	return (
		<div className="flex flex-col">
			<DashboardFilter>
				<LatencyForm />
			</DashboardFilter>
			<LatencyTable />
		</div>
	);
};

export default MainLatencyComponent;
