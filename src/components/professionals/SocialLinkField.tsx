"use client";

import type { ReactNode } from "react";
import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UpdateSocialLinksInput } from "@/features/professionals";

interface Props {
	control: Control<UpdateSocialLinksInput>;
	name: keyof UpdateSocialLinksInput;
	label: string;
	placeholder: string;
	icon: ReactNode;
}

export function SocialLinkField({
	control,
	name,
	label,
	placeholder,
	icon,
}: Props) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="flex items-center gap-2">
						{icon}
						{label}
					</FormLabel>
					<FormControl>
						<Input
							placeholder={placeholder}
							{...field}
							value={field.value ?? ""}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
