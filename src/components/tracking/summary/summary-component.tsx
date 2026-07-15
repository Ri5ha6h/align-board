import { SummaryAccordion } from "@/components/accord-util";

import { SummaryForm } from "./summary-form";
import { SummaryTable } from "./summary-table";

const MainSummaryComponent = ({ isAlignUser }: { isAlignUser: boolean }) => {
	return (
		<div className="flex flex-col">
			<SummaryAccordion />
			<SummaryForm isAlignUser={isAlignUser} />
			<SummaryTable isAlignUser={isAlignUser} />
		</div>
	);
};

export default MainSummaryComponent;
