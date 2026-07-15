import { SummaryAccordion } from "@/components/accord-util";
import { SummaryForm } from "./summary-form";
import { SummaryTable } from "./summary-table";

const MainSummaryComponent = ({ isJTUser }: { isJTUser: boolean }) => {
	return (
		<div className="flex flex-col">
			<SummaryAccordion />
			<SummaryForm isJTUser={isJTUser} />
			<SummaryTable isJTUser={isJTUser} />
		</div>
	);
};

export default MainSummaryComponent;
