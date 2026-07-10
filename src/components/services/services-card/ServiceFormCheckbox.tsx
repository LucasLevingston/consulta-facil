"use client";

import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CreateServiceInput } from "@/features/services";

interface Props {
	form: UseFormReturn<CreateServiceInput>;
}

export function ServiceFormCheckbox({ form }: Props) {
	return (
		<div className="flex items-center gap-2">
			<Checkbox
				id="requiresConsultation"
				checked={form.watch("requiresConsultation")}
				onCheckedChange={(v) => form.setValue("requiresConsultation", !!v)}
			/>
			<Label htmlFor="requiresConsultation" className="cursor-pointer text-sm">
				Requer consulta prévia
			</Label>
		</div>
	);
}
