"use client";

import { Eye, EyeClosed } from "lucide-react";
import { DM_Mono, Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useId, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AuthType } from "@/utils/common-types";

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

const inputClassName =
	"h-[54px] rounded-[2px] border-[#d4d4d8] bg-white px-4 text-[15px] font-medium text-[#202023] shadow-none placeholder:text-[#a1a1aa] focus-visible:border-[#202023] focus-visible:ring-[3px] focus-visible:ring-[rgba(32,32,35,0.1)] md:text-[15px]";

interface AuthRouteShellProps {
	children: ReactNode;
	formIntro: string;
	formTitle: string;
	heroDescription: string;
	heroTitle: readonly [firstLine: string, secondLine: string];
	legalCopy: string;
	statusLabel: string;
}

interface AuthCredentialsFieldsProps {
	form: UseFormReturn<AuthType>;
	passwordAutoComplete: string;
	passwordPlaceholder: string;
}

interface AuthFormActionsProps {
	actionLabel: string;
	isPending: boolean;
	linkHref: string;
	linkLabel: string;
	metadataText: string;
	pendingLabel: string;
}

const RoutePlot = () => (
	<div aria-hidden="true" className="pointer-events-none absolute inset-[12%_3%_5%_9%]">
		<svg className="h-full w-full overflow-visible" viewBox="0 0 800 650">
			<path
				d="M20 512 C170 300 270 580 420 336 S650 170 790 225"
				fill="none"
				stroke="#444449"
				strokeWidth="1"
			/>
			<path
				d="M34 540 C145 430 186 316 302 354 S436 454 523 317 S664 136 774 190"
				fill="none"
				stroke="#f4f4f5"
				strokeDasharray="8 10"
				strokeWidth="2"
				className="animate-[auth-route-flow_10s_linear_infinite] motion-reduce:animate-none"
			/>
			{[
				[34, 540],
				[302, 354],
				[774, 190],
			].map(([cx, cy]) => (
				<circle
					key={`${cx}-${cy}`}
					cx={cx}
					cy={cy}
					r="7"
					fill="#202023"
					stroke="#f4f4f5"
					strokeWidth="2"
				/>
			))}
			<circle cx="523" cy="317" r="8" fill="#a1a1aa" stroke="#202023" strokeWidth="5" />
		</svg>
	</div>
);

const Brand = () => (
	<div className="relative z-10 flex items-center gap-3 [font-family:var(--font-auth-mono)] text-[13px] font-medium tracking-[0.14em] uppercase">
		<Image
			alt=""
			aria-hidden="true"
			className="size-7 object-cover"
			height={28}
			priority
			src="/alignbits-logo.jpg"
			width={28}
		/>
		<strong>Alignbits</strong>
		<span className="ml-auto hidden text-[10px] text-[#a1a1aa] min-[851px]:block">
			Tracking network / live
		</span>
	</div>
);

const Legend = () => (
	<div className="relative z-10 hidden gap-[26px] [font-family:var(--font-auth-mono)] text-[10px] tracking-[0.1em] text-[#a1a1aa] uppercase min-[851px]:flex">
		<span>
			<i className="mr-2 inline-block size-1.5 rounded-full bg-[#f4f4f5]" />
			Route confirmed
		</span>
		<span>
			<i className="mr-2 inline-block size-1.5 rounded-full bg-[#a1a1aa]" />
			Attention point
		</span>
	</div>
);

const AuthRouteShell = ({
	children,
	formIntro,
	formTitle,
	heroDescription,
	heroTitle,
	legalCopy,
	statusLabel,
}: AuthRouteShellProps) => (
	<main
		className={`${manrope.variable} ${dmMono.variable} grid min-h-screen bg-[#202023] [font-family:var(--font-auth-sans)] text-[#fafafa] min-[851px]:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)]`}
	>
		<section
			aria-label="Alignbits route network"
			className="relative flex min-h-[300px] flex-col overflow-hidden border-b border-[#444449] p-6 min-[851px]:min-h-screen min-[851px]:border-r min-[851px]:border-b-0 min-[851px]:px-[46px] min-[851px]:pt-[34px] min-[851px]:pb-[42px]"
		>
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,#000,transparent_76%)] bg-[size:48px_48px]" />
			<Brand />
			<RoutePlot />
			<div className="relative z-10 mt-[62px] mb-[34px] max-w-[710px] min-[851px]:my-auto">
				<p className="[font-family:var(--font-auth-mono)] text-[11px] font-medium tracking-[0.17em] text-[#f4f4f5] uppercase">
					One network. Every movement.
				</p>
				<h1 className="mt-[18px] mb-[22px] text-[54px] leading-[0.93] font-medium tracking-[-0.065em] min-[851px]:text-[clamp(54px,7vw,104px)]">
					{heroTitle[0]}
					<br />
					{heroTitle[1]}
				</h1>
				<p className="hidden max-w-[480px] text-[17px] leading-[1.7] text-[#a1a1aa] min-[851px]:block">
					{heroDescription}
				</p>
			</div>
			<Legend />
		</section>

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

const AuthCredentialsFields = ({
	form,
	passwordAutoComplete,
	passwordPlaceholder,
}: AuthCredentialsFieldsProps) => {
	const id = useId();
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
			<FormField
				control={form.control}
				name="username"
				render={({ field }) => (
					<FormItem className="gap-0">
						<FormLabel
							htmlFor={`${id}-username`}
							className="mb-[9px] [font-family:var(--font-auth-mono)] text-[10px] font-medium tracking-[0.12em] text-[#71717a] uppercase"
						>
							Username
						</FormLabel>
						<FormControl>
							<Input
								id={`${id}-username`}
								type="text"
								autoComplete="username"
								placeholder="Enter your username"
								className={inputClassName}
								required
								{...field}
							/>
						</FormControl>
						<FormMessage className="mt-1.5 text-xs leading-4" />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="password"
				render={({ field }) => (
					<FormItem className="mt-[22px] gap-0">
						<FormLabel
							htmlFor={`${id}-password`}
							className="mb-[9px] [font-family:var(--font-auth-mono)] text-[10px] font-medium tracking-[0.12em] text-[#71717a] uppercase"
						>
							Password
						</FormLabel>
						<div className="relative">
							<FormControl>
								<Input
									id={`${id}-password`}
									type={showPassword ? "text" : "password"}
									autoComplete={passwordAutoComplete}
									placeholder={passwordPlaceholder}
									className={`${inputClassName} pr-12`}
									required
									{...field}
								/>
							</FormControl>
							<Button
								type="button"
								aria-label={showPassword ? "Hide password" : "Show password"}
								onClick={() => setShowPassword((visible) => !visible)}
								size="icon"
								variant="ghost"
								className="absolute top-[7px] right-2 size-10 cursor-pointer rounded-none p-0 text-[#71717a] shadow-none hover:bg-transparent hover:text-[#202023] focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#202023]"
							>
								{showPassword ? (
									<EyeClosed className="size-5" />
								) : (
									<Eye className="size-5" />
								)}
							</Button>
						</div>
						<FormMessage className="mt-1.5 text-xs leading-4" />
					</FormItem>
				)}
			/>
		</>
	);
};

const AuthFormActions = ({
	actionLabel,
	isPending,
	linkHref,
	linkLabel,
	metadataText,
	pendingLabel,
}: AuthFormActionsProps) => (
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
			type="submit"
			disabled={isPending}
			className="h-14 w-full justify-between rounded-[2px] bg-[#202023] px-[18px] text-left text-[13px] font-bold tracking-[0.04em] text-[#fafafa] shadow-none hover:bg-[#3f3f46] focus-visible:ring-[#202023]/20"
		>
			<span>{isPending ? pendingLabel : actionLabel}</span>
			<span aria-hidden="true" className="text-xl font-normal">
				→
			</span>
		</Button>
	</>
);

export { AuthCredentialsFields, AuthFormActions, AuthRouteShell };
