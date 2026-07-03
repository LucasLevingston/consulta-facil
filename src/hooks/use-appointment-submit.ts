"use client";

import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { ProfessionalResponse } from "@/features/professionals";
import { useCancelAppointment } from "@/hooks/api/appointments/use-cancel-appointment";
import { useScheduleAppointment } from "@/hooks/api/appointments/use-schedule-appointment";
import type { AppointmentFormValues } from "@/lib/schemas/appointment/appointment-form.schema";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

interface UseAppointmentSubmitProps {
	type: "create" | "schedule" | "cancel";
	appointment?: AppointmentResponse;
	setOpen?: Dispatch<SetStateAction<boolean>>;
	form: UseFormReturn<AppointmentFormValues>;
	selectedProfessional?: ProfessionalResponse;
	selectedServiceId: string | null;
}

export function useAppointmentSubmit({
	type,
	appointment,
	setOpen,
	form,
	selectedProfessional,
	selectedServiceId,
}: UseAppointmentSubmitProps) {
	const router = useRouter();
	const scheduleAppointment = useScheduleAppointment();
	const cancelAppointment = useCancelAppointment();

	const onSubmit = async (values: AppointmentFormValues) => {
		try {
			if (type === "create" || type === "schedule") {
				const created = await scheduleAppointment.mutateAsync({
					professionalId: selectedProfessional?.id ?? values.professionalId,
					scheduledAt: (values.scheduledAt as Date).toISOString(),
					reason: values.reason ?? undefined,
					notes: values.notes ?? undefined,
					modality: values.modality,
					chosenPaymentMethod: values.chosenPaymentMethod,
					serviceId: selectedServiceId ?? undefined,
				});
				if (created.checkoutUrl) {
					window.location.href = created.checkoutUrl;
					return;
				}
				if (type === "create") {
					form.reset();
					router.push(`/dashboard/appointments/${created.id}`);
				} else {
					setOpen?.(false);
					form.reset();
				}
			} else if (type === "cancel") {
				if (!appointment) return;
				await cancelAppointment.mutateAsync({
					id: appointment.id,
					data: { cancellationReason: values.cancellationReason ?? "" },
				});
				setOpen?.(false);
				form.reset();
			}
		} catch (error: unknown) {
			toast.error((error instanceof Error ? error.message : null) ?? "Erro ao processar consulta.");
		}
	};

	return {
		onSubmit,
		isPending: scheduleAppointment.isPending || cancelAppointment.isPending,
	};
}
