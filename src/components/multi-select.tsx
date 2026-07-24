"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

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
						className={cn("dashboard-carrier-trigger", className)}
						disabled={disabled}
						type="button"
						variant="outline"
					>
						<span className="dashboard-carrier-trigger-copy">
							{value.length ? `${value.length} selected` : placeholder}
						</span>
						<ChevronsUpDown aria-hidden="true" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					className="dashboard-popover dashboard-carrier-popover p-0"
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
											className="dashboard-carrier-option"
											disabled={option.disable || limitReached}
											key={option.value}
											onSelect={() => toggleOption(option)}
											value={`${option.label} ${option.value}`}
										>
											<span
												aria-hidden="true"
												className={cn(
													"dashboard-carrier-check",
													isSelected &&
														"dashboard-carrier-check--selected",
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
						<div className="dashboard-carrier-footer">
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
					<div aria-label="Selected carriers" className="dashboard-carrier-chips">
						{value.map((option) => (
							<Badge className="dashboard-carrier-chip" key={option.value}>
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
