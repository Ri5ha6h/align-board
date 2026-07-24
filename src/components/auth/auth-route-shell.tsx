import { DM_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { AuthRouteHero } from "@/components/auth/auth-route-hero";

const manrope = Manrope({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-auth-sans",
	weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-auth-mono",
	weight: ["400", "500"],
});

interface AuthRouteShellProps {
	children: ReactNode;
	formIntro: string;
	formTitle: string;
	heroDescription: string;
	heroTitle: readonly [firstLine: string, secondLine: string];
	legalCopy: string;
	statusLabel: string;
}

export function AuthRouteShell({
	children,
	formIntro,
	formTitle,
	heroDescription,
	heroTitle,
	legalCopy,
	statusLabel,
}: AuthRouteShellProps) {
	return (
		<main
			className={`${manrope.variable} ${dmMono.variable} grid min-h-screen bg-[#202023] [font-family:var(--font-auth-sans)] text-[#fafafa] min-[851px]:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)]`}
		>
			<AuthRouteHero heroDescription={heroDescription} heroTitle={heroTitle} />
			<section className="flex items-center justify-center bg-[#f7f7f7] px-6 py-12 text-[#202023] min-[851px]:p-[42px]">
				<div className="w-full max-w-[390px]">
					<div className="flex items-center gap-2 [font-family:var(--font-auth-mono)] text-[10px] font-medium tracking-[0.12em] text-[#71717a] uppercase before:size-[7px] before:rounded-full before:bg-[#202023] before:shadow-[0_0_0_5px_rgba(32,32,35,0.09)]">
						{statusLabel}
					</div>
					<h2 className="mt-[27px] mb-[7px] text-[36px] leading-tight font-bold tracking-[-0.04em]">
						{formTitle}
					</h2>
					<p className="mb-[34px] text-sm text-[#71717a]">{formIntro}</p>
					{children}
					<p className="mt-[25px] text-center text-[11px] leading-[1.6] text-[#71717a]">
						{legalCopy}
					</p>
				</div>
			</section>
		</main>
	);
}

export { AuthCredentialsFields } from "@/components/auth/auth-credentials-fields";
export { AuthFormActions } from "@/components/auth/auth-form-actions";
