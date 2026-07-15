import * as React from "react";

import { cn } from "@/lib/utils";

const DualSplit = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("flex h-screen", className)} {...props} />
	),
);
DualSplit.displayName = "DualSplit";

const DualSplitTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"font-semibold text-4xl text-white uppercase leading-none tracking-wider",
			className,
		)}
		{...props}
	/>
));
DualSplitTitle.displayName = "DualSplitTitle";

const DualSplitSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("flex flex-1 items-center justify-center", className)}
			{...props}
		/>
	),
);
DualSplitSection.displayName = "DualSplitSection";

export { DualSplit, DualSplitTitle, DualSplitSection };
