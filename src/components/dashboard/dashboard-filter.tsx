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
		<Accordion
			className="mb-[18px] border border-dashboard-line bg-dashboard-ink"
			collapsible
			defaultValue="filters"
			type="single"
		>
			<AccordionItem className="border-0" value="filters">
				<AccordionTrigger className="px-4 py-[13px] font-dashboard-code text-[10px] tracking-[0.08em] text-dashboard-white uppercase">
					<span className="flex items-center gap-2">
						<SlidersHorizontal className="size-3.5" />
						Filter data
					</span>
				</AccordionTrigger>
				<AccordionContent
					className="[&>div]:p-0"
					rootClassName="border-t border-dashboard-line data-[state=open]:overflow-visible"
				>
					{children}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
