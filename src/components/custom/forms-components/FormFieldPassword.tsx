"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { CustomInput } from "@/components/custom/custom-input";
import { FormControl } from "@/components/ui/form";

// biome-ignore lint/suspicious/noExplicitAny: shared field component works with any form schema
type AnyField = ControllerRenderProps<any, string>;

interface Props {
	field: AnyField;
	placeholder: string | undefined;
	disabled?: boolean;
}

export function FormFieldPassword({ field, placeholder, disabled }: Props) {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<FormControl>
			<div className="relative">
				<CustomInput
					type={showPassword ? "text" : "password"}
					placeholder={placeholder}
					disabled={disabled}
					{...field}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
				>
					{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
				</button>
			</div>
		</FormControl>
	);
}
