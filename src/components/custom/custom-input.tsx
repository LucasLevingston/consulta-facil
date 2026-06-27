"use client";

import { cn } from "@/lib/utils/cn";
import { getIconByFormName } from "@/utils/get-icon-by-form-name";
import { Input } from "../ui/input";
import type { CustomInputProps } from "./custom-input.types";

export const CustomInput = ({
	icon: Icon,
	className,
	name,
	...props
}: CustomInputProps) => {
	const FormIcon = name ? getIconByFormName(name) : null;

	return (
		<div
			className={cn(
				"group relative flex h-14 w-full items-center overflow-hidden rounded-2xl border transition-all duration-200",

				"border-zinc-200 bg-white",

				"dark:border-white/10 dark:bg-[#1F1F1F]",

				"focus-within:border-primary/60",
				"focus-within:ring-4 focus-within:ring-primary/10",
			)}
		>
			{(Icon || FormIcon) && (
				<div className="pointer-events-none absolute left-4 flex items-center">
					{Icon ? (
						<Icon
							className={cn(
								"h-4 w-4 transition-colors",
								"text-zinc-400",
								"dark:text-white/40",
								"group-focus-within:text-primary",
							)}
						/>
					) : FormIcon ? (
						<FormIcon
							className={cn(
								"h-4 w-4 transition-colors",
								"text-zinc-400",
								"dark:text-white/40",
								"group-focus-within:text-primary",
							)}
						/>
					) : null}
				</div>
			)}

			<Input
				{...props}
				name={name}
				className={cn(
					"h-full border-0 bg-transparent text-sm shadow-none outline-none ring-0 transition-all",

					"text-zinc-900 placeholder:text-zinc-400",

					"dark:text-white dark:placeholder:text-white/35",

					"focus-visible:ring-0 focus-visible:ring-offset-0",

					(Icon || FormIcon) && "pl-11",

					className,
				)}
			/>
		</div>
	);
};
