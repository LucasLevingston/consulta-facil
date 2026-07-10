"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateServiceInput } from "@/features/services";

interface Props {
	form: UseFormReturn<CreateServiceInput>;
}

export function ServiceFormPriceGrid({ form }: Props) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="space-y-1">
				<Label htmlFor="price">Preço (R$) *</Label>
				<Input
					id="price"
					type="number"
					min={0}
					step={0.01}
					{...form.register("price", { valueAsNumber: true })}
				/>
				{form.formState.errors.price && (
					<p className="text-xs text-destructive">
						{form.formState.errors.price.message}
					</p>
				)}
			</div>
			<div className="space-y-1">
				<Label htmlFor="duration">Duração (min) *</Label>
				<Input
					id="duration"
					type="number"
					min={1}
					{...form.register("durationMinutes", { valueAsNumber: true })}
				/>
				{form.formState.errors.durationMinutes && (
					<p className="text-xs text-destructive">
						{form.formState.errors.durationMinutes.message}
					</p>
				)}
			</div>
		</div>
	);
}
