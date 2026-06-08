"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { setHours, setMinutes } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { VoiceBookingResult } from "@/app/api/voice-booking/route";
import type { TimeSlot } from "@/components/forms/Appointments/steps/DateTimeStep";
import { useCancelAppointment } from "@/hooks/api/appointments/use-cancel-appointment";
import { useProfessionalAppointments } from "@/hooks/api/appointments/use-professional-appointments";
import { useScheduleAppointment } from "@/hooks/api/appointments/use-schedule-appointment";
import { useProfessionals } from "@/hooks/api/doctors/use-professionals";
import { useProfessionalSchedule } from "@/hooks/api/schedule/use-professional-schedule";
import { useGetProfessionalServices } from "@/hooks/api/services/use-get-professional-services";
import {
	type AppointmentFormValues,
	appointmentFormSchema,
} from "@/lib/schemas/appointment/appointment-form.schema";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { DayOfWeek } from "@/lib/schemas/schedule/days-of-week.schema";
import { computeSlots } from "@/lib/utils/compute-slots";
import { useUserStore } from "@/store/useUserStore";
import { JS_DAY_TO_DOW } from "@/utils/constants/day-to-dow";

interface UseAppointmentFormSetupProps {
	type: "create" | "schedule" | "cancel";
	appointment?: AppointmentResponse;
	setOpen?: Dispatch<SetStateAction<boolean>>;
	voicePreset?: VoiceBookingResult | null;
}

export function useAppointmentFormSetup({
	type,
	appointment,
	setOpen,
	voicePreset,
}: UseAppointmentFormSetupProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const professionalIdParam =
		searchParams.get("professionalid") ?? searchParams.get("doctorid");
	const serviceIdParam = searchParams.get("serviceid");
	const { user: authUser } = useUserStore();

	const { data: professionalsPage, isLoading: professionalsLoading } =
		useProfessionals(0, 100);
	const professionals = professionalsPage?.content ?? [];

	const scheduleAppointment = useScheduleAppointment();
	const cancelAppointment = useCancelAppointment();

	const [selectedTime, setSelectedTime] = useState<string>("");
	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
		serviceIdParam,
	);

	const form = useForm<AppointmentFormValues>({
		resolver: zodResolver(appointmentFormSchema),
		defaultValues: {
			professionalId: appointment?.professionalId ?? professionalIdParam ?? "",
			scheduledAt: appointment ? new Date(appointment.scheduledAt) : undefined,
			reason: appointment?.reason ?? "",
			notes: appointment?.notes ?? "",
			cancellationReason: "",
			userId: authUser?.id ?? "",
			modality: appointment?.modality ?? "IN_PERSON",
		},
	});

	useEffect(() => {
		if (!voicePreset) return;
		if (voicePreset.reason) form.setValue("reason", voicePreset.reason);
		if (voicePreset.modality) form.setValue("modality", voicePreset.modality);
		if (voicePreset.date) {
			const d = new Date(`${voicePreset.date}T12:00:00`);
			if (!Number.isNaN(d.getTime())) form.setValue("scheduledAt", d);
		}
	}, [voicePreset, form]);

	const selectedProfessionalId = form.watch("professionalId");
	const selectedDate = form.watch("scheduledAt");
	const selectedProfessional = professionals.find(
		(d) =>
			d.id === selectedProfessionalId || d.userId === selectedProfessionalId,
	);

	const { data: scheduleList = [], isLoading: scheduleLoading } =
		useProfessionalSchedule(selectedProfessional?.id ?? "");

	const { data: professionalServices = [] } = useGetProfessionalServices(
		selectedProfessional?.id ?? "",
	);
	const selectedService = professionalServices.find(
		(s) => s.id === selectedServiceId,
	);

	const { data: professionalAppointmentsPage } = useProfessionalAppointments(
		selectedProfessional?.id ?? "",
		0,
		200,
	);

	const bookedTimesForDate = useMemo<Set<string>>(() => {
		if (!selectedDate || !professionalAppointmentsPage) return new Set();
		const dateStr = selectedDate.toDateString();
		return new Set(
			(professionalAppointmentsPage.content ?? [])
				.filter(
					(a) =>
						a.status !== "CANCELED" &&
						new Date(a.scheduledAt).toDateString() === dateStr,
				)
				.map((a) => {
					const d = new Date(a.scheduledAt);
					return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
				}),
		);
	}, [selectedDate, professionalAppointmentsPage]);

	const activeDaySet = useMemo<Set<DayOfWeek>>(
		() =>
			new Set(
				scheduleList
					.filter((s) => s.isActive)
					.map((s) => s.dayOfWeek as DayOfWeek),
			),
		[scheduleList],
	);

	const availableSlots = useMemo<TimeSlot[]>(() => {
		if (!selectedDate || scheduleList.length === 0) return [];
		const dow = JS_DAY_TO_DOW[selectedDate.getDay()];
		const daySchedule = scheduleList.find(
			(s) => s.dayOfWeek === dow && s.isActive,
		);
		if (!daySchedule) return [];
		return computeSlots(daySchedule, selectedService?.durationMinutes);
	}, [selectedDate, scheduleList, selectedService]);

	const isQueueMode =
		!!selectedProfessional && !scheduleLoading && scheduleList.length === 0;

	const isDayDisabled = (date: Date): boolean => {
		if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
		if (scheduleList.length === 0) return false;
		const dow = JS_DAY_TO_DOW[date.getDay()];
		return !activeDaySet.has(dow);
	};

	const handleTimeSelect = (slot: TimeSlot) => {
		setSelectedTime(slot.label);
		const base = selectedDate ?? new Date();
		form.setValue(
			"scheduledAt",
			setMinutes(setHours(base, slot.hours), slot.minutes),
		);
	};

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
			toast.error(
				(error instanceof Error ? error.message : null) ??
					"Erro ao processar consulta.",
			);
		}
	};

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
		isPending: scheduleAppointment.isPending || cancelAppointment.isPending,
		professionalIdParam,
	};
}
