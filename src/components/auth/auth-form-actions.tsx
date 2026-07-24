import Link from "next/link";

import { Button } from "@/components/ui/button";

interface AuthFormActionsProps {
	actionLabel: string;
	isPending: boolean;
	linkHref: string;
	linkLabel: string;
	metadataText: string;
	pendingLabel: string;
}

export function AuthFormActions({
	actionLabel,
	isPending,
	linkHref,
	linkLabel,
	metadataText,
	pendingLabel,
}: AuthFormActionsProps) {
	return (
		<>
			<div className="mt-4 mb-[27px] flex items-center justify-between text-xs text-[#71717a]">
				<span>{metadataText}</span>
				<Link
					className="border-b border-[#d4d4d8] text-[#202023] no-underline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#202023]"
					href={linkHref}
				>
					{linkLabel}
				</Link>
			</div>
			<Button
				className="h-14 w-full justify-between rounded-[2px] bg-[#202023] px-[18px] text-left text-[13px] font-bold tracking-[0.04em] text-[#fafafa] shadow-none hover:bg-[#3f3f46] focus-visible:ring-[#202023]/20"
				disabled={isPending}
				type="submit"
			>
				<span>{isPending ? pendingLabel : actionLabel}</span>
				<span aria-hidden="true" className="text-xl font-normal">
					→
				</span>
			</Button>
		</>
	);
}
