"use client";

import { SlidersHorizontal } from "lucide-react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export function DashboardFilter({ children }: { children: React.ReactNode }) {
	return (
		<Accordion className="dashboard-filter" collapsible defaultValue="filters" type="single">
			<AccordionItem value="filters">
				<AccordionTrigger>
					<span className="flex items-center gap-2">
						<SlidersHorizontal className="size-3.5" />
						Filter data
					</span>
				</AccordionTrigger>
				<AccordionContent>{children}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
