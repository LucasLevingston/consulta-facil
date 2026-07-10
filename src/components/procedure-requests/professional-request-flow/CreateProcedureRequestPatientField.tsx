"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { CreateProcedureRequestInput } from "@/features/procedure-requests";

interface Props {
	form: UseFormReturn<CreateProcedureRequestInput>;
	patients: { id: string; name: string }[];
}

export function CreateProcedureRequestPatientField({ form, patients }: Props) {
	const error = form.formState.errors.patientId?.message;
	return (
		<div className="space-y-1">
			<Label>Paciente *</Label>
			{patients.length > 0 ? (
				<Select
					onValueChange={(v) => form.setValue("patientId", v)}
					value={form.watch("patientId")}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecione um paciente" />
					</SelectTrigger>
					<SelectContent>
						{patients.map((p) => (
							<SelectItem key={p.id} value={p.id}>
								{p.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			) : (
				<Input placeholder="ID do paciente" {...form.register("patientId")} />
			)}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	);
}
