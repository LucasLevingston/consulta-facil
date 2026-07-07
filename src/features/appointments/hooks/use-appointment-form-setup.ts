"use client";

import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import type { UseAppointmentFormSetupProps } from "./use-appointment-form-setup.types";
import { useAppointmentFormState } from "./use-appointment-form-state";
import { useAppointmentProfessionalData } from "./use-appointment-professional-data";
import { useAppointmentSlots } from "./use-appointment-slots";
import { useAppointmentSubmit } from "./use-appointment-submit";

export function useAppointmentFormSetup({
	type,
	appointment,
	setOpen,
	voicePreset,
}: UseAppointmentFormSetupProps) {
	const searchParams = useSearchParams();
	const professionalIdParam =
		searchParams.get("professionalid") ?? searchParams.get("doctorid");
	const serviceIdParam = searchParams.get("serviceid");
	const { user: authUser } = useUserStore();
	const {
		form,
		selectedTime,
		setSelectedTime,
		selectedServiceId,
		setSelectedServiceId,
	} = useAppointmentFormState({
		appointment,
		professionalIdParam,
		serviceIdParam,
		userId: authUser?.id ?? "",
		voicePreset,
	});
	const selectedProfessionalId = form.watch("professionalId");
	const selectedDate = form.watch("scheduledAt");
	const {
		professionals,
		professionalsLoading,
		selectedProfessional,
		scheduleList,
		scheduleLoading,
		selectedService,
	} = useAppointmentProfessionalData({
		selectedProfessionalId,
		selectedServiceId,
	});
	const {
		bookedTimesForDate,
		availableSlots,
		isQueueMode,
		isDayDisabled,
		handleTimeSelect,
	} = useAppointmentSlots({
		professionalId: selectedProfessional?.id ?? "",
		selectedDate,
		selectedService,
		scheduleList,
		scheduleLoading,
		form,
		setSelectedTime,
	});
	const { onSubmit, isPending } = useAppointmentSubmit({
		type,
		appointment,
		setOpen,
		form,
		selectedProfessional,
		selectedServiceId,
	});
	return {
		form,
		professionals,
		professionalsLoading,
		selectedProfessional,
		selectedDate,
		selectedServiceId,
		setSelectedServiceId,
		selectedTime,
		setSelectedTime,
		availableSlots,
		bookedTimesForDate,
		isQueueMode,
		scheduleLoading,
		isDayDisabled,
		handleTimeSelect,
		onSubmit,
		isPending,
		professionalIdParam,
	};
}
export type UseAppointmentFormSetupReturn = ReturnType<
	typeof useAppointmentFormSetup
>;
