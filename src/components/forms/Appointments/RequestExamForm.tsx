"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FlaskConical } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	type CreateExamRequestInput,
	createExamRequestSchema,
} from "@/features/exams";
import { EXAM_TYPE_OPTIONS } from "@/utils/constants/exam-types";

import type { RequestExamFormProps } from "./RequestExamForm.types";
import { useCreateExamRequest } from "./use-create-exam-request";

export function RequestExamForm({ appointmentId }: RequestExamFormProps) {
	const { mutateAsync: create } = useCreateExamRequest(appointmentId);
	const [open, setOpen] = useState(false);

	const form = useForm<CreateExamRequestInput>({
		resolver: zodResolver(createExamRequestSchema),
		defaultValues: { instructions: "" },
	});

	async function onSubmit(values: CreateExamRequestInput) {
		try {
			await create(values);
			toast.success("Solicitação de exame criada!");
			form.reset();
			setOpen(false);
		} catch {
			toast.error("Erro ao solicitar exame.");
		}
	}

	if (!open) {
		return (
			<Button
				size="sm"
				variant="outline"
				className="gap-2"
				onClick={() => setOpen(true)}
			>
				<FlaskConical className="h-3.5 w-3.5" />
				Solicitar exame
			</Button>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.SELECT}
					name="examName"
					label="Nome do exame"
					placeholder="Selecione o exame"
					selectOptions={EXAM_TYPE_OPTIONS}
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.TEXTAREA}
					name="instructions"
					label="Instruções (opcional)"
					placeholder="Ex: Em jejum por 8 horas"
				/>
				<div className="flex gap-2">
					<CustomSubmitButton form={form} submittingText="Solicitando...">
						Solicitar
					</CustomSubmitButton>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setOpen(false)}
					>
						Cancelar
					</Button>
				</div>
			</form>
		</Form>
	);
}
