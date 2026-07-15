"use client";

import { Eye, EyeClosed } from "lucide-react";
import React, { useId } from "react";

import { DualSplit, DualSplitSection, DualSplitTitle } from "@/components/dual-split";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AuthType } from "@/utils/common-types";
import { useSignInSubmitMutation } from "@/utils/mutation";
import { useAuthForm } from "@/utils/schema";

const SignIn = () => {
	const id = useId();
	const form = useAuthForm();
	const [showPassword, setShowPassword] = React.useState(false);
	const eyeCss = "h-5 w-5";

	const { mutate: server_SignIn, isPending: signInPending } = useSignInSubmitMutation(form);

	const onSubmit = async (data: AuthType) => {
		server_SignIn(data);
	};

	const togglePassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<DualSplit>
			<DualSplitSection className="hidden bg-black 1lg:flex">
				<DualSplitTitle>ALIGNBITS</DualSplitTitle>
			</DualSplitSection>
			<DualSplitSection>
				<div className="flex flex-col">
					<div>
						<div className="flex items-center justify-between font-bold 1lg:hidden">
							<p className="text-lg">ALIGNBITS</p>
							<span className="text-2xl">SignIn</span>
						</div>
						<p className="hidden text-2xl font-bold 1lg:block">Sign in</p>
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="mt-4 w-[340px] space-y-5 rounded-md border border-gray-200 p-3"
						>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg" htmlFor={`${id}-username`}>
											Username
										</FormLabel>
										<FormControl id={`${id}-username`}>
											<Input
												type="text"
												required
												placeholder="Enter your username.."
												autoComplete="on"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg" htmlFor={`${id}-password`}>
											Password
										</FormLabel>
										<FormControl id={`${id}-password`}>
											<div className="relative">
												<Input
													type={showPassword ? "text" : "password"}
													required
													placeholder="Enter your password.."
													autoComplete="off"
													{...field}
												/>
												<div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-black">
													{showPassword ? (
														<EyeClosed
															className={cn(eyeCss)}
															onClick={togglePassword}
														/>
													) : (
														<Eye
															className={cn(eyeCss)}
															onClick={togglePassword}
														/>
													)}
												</div>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								disabled={signInPending}
								className="w-full capitalize"
							>
								{signInPending ? "Processing..." : "Sign In"}
							</Button>
						</form>
					</Form>
				</div>
			</DualSplitSection>
		</DualSplit>
	);
};

export default SignIn;
