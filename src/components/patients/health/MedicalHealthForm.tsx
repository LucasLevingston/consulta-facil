"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useMedicalHealthForm } from "@/features/patients/hooks/use-medical-health-form";
import type { MedicalHealthFormProps } from "./MedicalHealthForm.types";
import { MedicalHistorySection } from "./MedicalHistorySection";
import { MedicalVitalsSection } from "./MedicalVitalsSection";

export function MedicalHealthForm({ userId }: MedicalHealthFormProps) {
	const { form, bmi, isPending, onSubmit } = useMedicalHealthForm(userId);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Dados de saúde</CardTitle>
				<CardDescription>
					Tipo sanguíneo, altura, peso e histórico médico.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<MedicalVitalsSection control={form.control} bmi={bmi} />
						<MedicalHistorySection
							control={form.control}
							isPending={isPending}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
