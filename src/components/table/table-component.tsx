// Custom table utilities and wrappers for shadcn/ui table components.
// This file provides additional tooltip and header helpers for use with shadcn/ui tables.
// Do not duplicate shadcn/ui components here; extend only as needed for custom features.
//
// See src/components/ui/table.tsx for the canonical shadcn/ui table implementation.

import { InfoCircle } from "@/components/icons/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const TableCellTooltip = ({ ...props }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{props.children}</TooltipTrigger>
				<TooltipContent className="item-center flex justify-center">
					{props.tip}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export const TableCellTooltipScroll = ({ ...props }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{props.children}</TooltipTrigger>
				<TooltipContent className="item-center flex w-72 justify-center text-wrap">
					<ScrollArea className="h-32">{props.tip}</ScrollArea>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export const TableHeaderTooltip = ({ ...props }) => {
	return (
		<div className="flex items-center">
			<p>{props.name}</p>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<InfoCircle className="h-5 w-5" />
					</TooltipTrigger>
					<TooltipContent>
						<p>{props.tip}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

// export const TableHeadCustom = ({ ...props }) => {
//   return <div className="w-32">{props.children}</div>;
// };

export const TableHeadCustom = ({ ...props }) => {
	return (
		<div className={cn("flex w-full items-center justify-center", props.className)}>
			{props.children}
		</div>
	);
};

export const TableCellCustom = ({ ...props }) => {
	return (
		<div className={cn("flex items-center justify-center", props.className)}>
			{props.children}
		</div>
	);
};

export const CommonTooltip = ({ ...props }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{props.children}</TooltipTrigger>
				<TooltipContent className="item-center flex justify-center">
					{props.tip}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
