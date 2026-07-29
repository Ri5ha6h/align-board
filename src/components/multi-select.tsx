"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { dashboardPopover } from "@/components/dashboard/dashboard-styles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Option {
	value: string;
	label: string;
	disable?: boolean;
}

interface MultipleSelectorProps {
	value?: Option[];
	defaultOptions?: Option[];
	placeholder?: string;
	emptyIndicator?: React.ReactNode;
	maxSelected?: number;
	onChange?: (options: Option[]) => void;
	disabled?: boolean;
	className?: string;
}

const EMPTY_OPTIONS: Option[] = [];

const MultipleSelector = React.forwardRef<HTMLButtonElement, MultipleSelectorProps>(
	(
		{
			value = EMPTY_OPTIONS,
			defaultOptions = EMPTY_OPTIONS,
			placeholder = "Select carriers…",
			emptyIndicator = "No carriers found.",
			maxSelected = Number.MAX_SAFE_INTEGER,
			onChange,
			disabled = false,
			className,
		},
		ref,
	) => {
		const [open, setOpen] = React.useState(false);
		const listboxId = React.useId();
		const selectedValues = React.useMemo(
			() => new Set(value.map((option) => option.value)),
			[value],
		);

		const toggleOption = React.useCallback(
			(option: Option) => {
				if (option.disable) return;
				if (selectedValues.has(option.value)) {
					onChange?.(value.filter((selected) => selected.value !== option.value));
					return;
				}
				if (value.length < maxSelected) {
					onChange?.([...value, option]);
				}
			},
			[maxSelected, onChange, selectedValues, value],
		);

		const removeOption = React.useCallback(
			(optionValue: string) => {
				onChange?.(value.filter((option) => option.value !== optionValue));
			},
			[onChange, value],
		);

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						aria-expanded={open}
						aria-haspopup="listbox"
						aria-controls={listboxId}
						className={cn(
							"min-h-[38px] w-full justify-between gap-2.5 rounded-[2px] border-dashboard-line bg-dashboard-night px-3 font-normal text-dashboard-white [&_svg]:w-3.5 [&_svg]:text-dashboard-mist",
							className,
						)}
						disabled={disabled}
						type="button"
						variant="outline"
					>
						<span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
							{value.length ? `${value.length} selected` : placeholder}
						</span>
						<ChevronsUpDown aria-hidden="true" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					className={cn(
						dashboardPopover,
						"w-(--radix-popover-trigger-width) min-w-[260px] p-0 [color-scheme:dark] [&_[data-slot=command-input-wrapper]]:border-dashboard-line [&_[data-slot=command-input]]:text-dashboard-white [&_[data-slot=command]]:bg-dashboard-night [&_[data-slot=command]]:text-dashboard-white",
					)}
					onOpenAutoFocus={(event) => event.preventDefault()}
				>
					<Command>
						<CommandInput aria-label="Search carriers" placeholder="Search carriers…" />
						<CommandList id={listboxId}>
							<CommandEmpty>{emptyIndicator}</CommandEmpty>
							<CommandGroup>
								{defaultOptions.map((option) => {
									const isSelected = selectedValues.has(option.value);
									const limitReached = value.length >= maxSelected && !isSelected;
									return (
										<CommandItem
											aria-selected={isSelected}
											className="rounded-none text-dashboard-white data-[disabled=true]:text-dashboard-mist data-[disabled=true]:opacity-45 data-[selected=true]:bg-dashboard-ink data-[selected=true]:text-dashboard-white"
											disabled={option.disable || limitReached}
											key={option.value}
											onSelect={() => toggleOption(option)}
											value={`${option.label} ${option.value}`}
										>
											<span
												aria-hidden="true"
												className={cn(
													"inline-grid size-[15px] place-items-center border border-dashboard-line text-transparent [&_svg]:w-[11px]",
													isSelected &&
														"border-dashboard-white bg-dashboard-panel text-dashboard-night",
												)}
											>
												<Check />
											</span>
											<span>{option.label}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
						</CommandList>
						<div className="flex min-h-[42px] items-center justify-between gap-3 border-t border-dashboard-line px-[9px] py-[7px] pl-3 font-dashboard-code text-[9px] tracking-[0.04em] text-dashboard-mist [&_button]:h-7 [&_button]:text-[9px] [&_button]:text-dashboard-white [&_button]:uppercase">
							<span aria-live="polite">
								{value.length} of {maxSelected} selected
							</span>
							<Button
								disabled={!value.length}
								onClick={() => onChange?.([])}
								size="sm"
								type="button"
								variant="ghost"
							>
								Clear
							</Button>
						</div>
					</Command>
				</PopoverContent>
				{value.length ? (
					<div
						aria-label="Selected carriers"
						className="mt-[7px] flex flex-wrap gap-[5px]"
					>
						{value.map((option) => (
							<Badge
								className="gap-[5px] rounded-[2px] border border-dashboard-line bg-dashboard-ink font-dashboard-code text-[9px] font-normal text-dashboard-white [&_button]:inline-grid [&_button]:size-[15px] [&_button]:place-items-center [&_button]:text-dashboard-mist [&_button:focus-visible]:outline [&_button:focus-visible]:outline-offset-1 [&_button:focus-visible]:outline-dashboard-white [&_svg]:w-[11px]"
								key={option.value}
							>
								<span>{option.label}</span>
								<button
									aria-label={`Remove ${option.label}`}
									disabled={disabled}
									onClick={() => removeOption(option.value)}
									type="button"
								>
									<X aria-hidden="true" />
								</button>
							</Badge>
						))}
					</div>
				) : null}
			</Popover>
		);
	},
);

MultipleSelector.displayName = "MultipleSelector";

export default MultipleSelector;
