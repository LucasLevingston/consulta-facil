"use client";

import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { CreateCouponData } from "@/features/billing";

interface Props {
	control: Control<CreateCouponData>;
}

export function CouponTypeValueGrid({ control }: Props) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<FormField
				control={control}
				name="type"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Tipo</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="PERCENT">Percentual (%)</SelectItem>
								<SelectItem value="FIXED">Fixo (R$)</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="value"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Valor</FormLabel>
						<FormControl>
							<Input
								{...field}
								type="number"
								min="0.01"
								step="0.01"
								onChange={(e) => field.onChange(e.target.valueAsNumber)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
