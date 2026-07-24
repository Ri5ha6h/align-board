"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useId, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AuthType } from "@/utils/common-types";

const INPUT_CLASS_NAME =
	"h-[54px] rounded-[2px] border-[#d4d4d8] bg-white px-4 text-[15px] font-medium text-[#202023] shadow-none placeholder:text-[#a1a1aa] focus-visible:border-[#202023] focus-visible:ring-[3px] focus-visible:ring-[rgba(32,32,35,0.1)] md:text-[15px]";

interface AuthCredentialsFieldsProps {
	form: UseFormReturn<AuthType>;
	passwordAutoComplete: string;
	passwordPlaceholder: string;
}

export function AuthCredentialsFields({
	form,
	passwordAutoComplete,
	passwordPlaceholder,
}: AuthCredentialsFieldsProps) {
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
							className="mb-[9px] [font-family:var(--font-auth-mono)] text-[10px] font-medium tracking-[0.12em] text-[#71717a] uppercase"
							htmlFor={`${id}-username`}
						>
							Username
						</FormLabel>
						<FormControl>
							<Input
								{...field}
								autoComplete="username"
								className={INPUT_CLASS_NAME}
								id={`${id}-username`}
								placeholder="Enter your username"
								required
								type="text"
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
							className="mb-[9px] [font-family:var(--font-auth-mono)] text-[10px] font-medium tracking-[0.12em] text-[#71717a] uppercase"
							htmlFor={`${id}-password`}
						>
							Password
						</FormLabel>
						<div className="relative">
							<FormControl>
								<Input
									{...field}
									autoComplete={passwordAutoComplete}
									className={`${INPUT_CLASS_NAME} pr-12`}
									id={`${id}-password`}
									placeholder={passwordPlaceholder}
									required
									type={showPassword ? "text" : "password"}
								/>
							</FormControl>
							<Button
								aria-label={showPassword ? "Hide password" : "Show password"}
								className="absolute top-[7px] right-2 size-10 cursor-pointer rounded-none p-0 text-[#71717a] shadow-none hover:bg-transparent hover:text-[#202023] focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#202023]"
								onClick={() => setShowPassword((visible) => !visible)}
								size="icon"
								type="button"
								variant="ghost"
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
}
