"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { useCancelAppointment } from "@/hooks/api/use-appointments";
import { cancelAppointmentSchema, type AppointmentResponse } from "@/lib/schemas/appointment.schema";

interface CancelAppointmentFormProps {
	appointment: AppointmentResponse;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CancelAppointmentForm({
	appointment,
	setOpen,
}: CancelAppointmentFormProps) {
	const cancelAppointment = useCancelAppointment();

	const form = useForm<z.infer<typeof cancelAppointmentSchema>>({
		resolver: zodResolver(cancelAppointmentSchema),
		defaultValues: { cancellationReason: "" },
	});

	const onSubmit = async (values: z.infer<typeof cancelAppointmentSchema>) => {
		try {
			await cancelAppointment.mutateAsync({
				id: appointment.id,
				data: { cancellationReason: values.cancellationReason },
			});
			setOpen(false);
			form.reset();
		} catch (error: unknown) {
			toast.error(
				(error instanceof Error ? error.message : null) ?? "Erro ao cancelar consulta.",
			);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<p className="text-sm text-muted-foreground">
					Tem certeza que deseja cancelar a consulta com{" "}
					<span className="font-semibold text-foreground">
						{appointment.doctorName ? `Dr. ${appointment.doctorName}` : "o médico"}
					</span>
					?
				</p>

				<CustomFormField
					form={form}
					fieldType={FormFieldType.TEXTAREA}
					name="cancellationReason"
					label="Motivo do cancelamento"
					placeholder="Descreva o motivo..."
				/>

				<CustomSubmitButton
					form={form}
					submittingText="Cancelando..."
					className="bg-destructive hover:bg-destructive/90"
				>
					Confirmar cancelamento
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
