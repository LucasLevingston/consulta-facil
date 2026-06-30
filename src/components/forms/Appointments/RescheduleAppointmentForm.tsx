"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import {
	type RescheduleAppointmentInput,
	rescheduleAppointmentSchema,
	useRescheduleAppointment,
} from "@/features/appointments";
import type { RescheduleAppointmentFormProps } from "./RescheduleAppointmentForm.types";

export function RescheduleAppointmentForm({
	appointment,
	setOpen,
}: RescheduleAppointmentFormProps) {
	const { mutateAsync: reschedule } = useRescheduleAppointment();

	const form = useForm<RescheduleAppointmentInput>({
		resolver: zodResolver(rescheduleAppointmentSchema),
		defaultValues: { reason: appointment.reason ?? "" },
	});

	async function onSubmit(values: RescheduleAppointmentInput) {
		try {
			await reschedule({ id: appointment.id, data: values });
			toast.success("Consulta remarcada com sucesso!");
			setOpen(false);
			form.reset();
		} catch (error: unknown) {
			toast.error(
				(error instanceof Error ? error.message : null) ??
					"Erro ao remarcar consulta.",
			);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.DATE_PICKER}
					name="scheduledAt"
					label="Nova data e horário"
					placeholder="Selecione a nova data"
				/>

				<CustomFormField
					form={form}
					fieldType={FormFieldType.TEXTAREA}
					name="reason"
					label="Motivo (opcional)"
					placeholder="Descreva o motivo da remarcação..."
				/>

				<CustomSubmitButton form={form} submittingText="Remarcando...">
					Confirmar remarcação
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
