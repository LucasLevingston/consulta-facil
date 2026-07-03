"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	type AppointmentFormValues,
	appointmentFormSchema,
} from "@/lib/schemas/appointment/appointment-form.schema";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { VoiceBookingResult } from "@/lib/types/ai";

interface UseAppointmentFormStateProps {
	appointment?: AppointmentResponse;
	professionalIdParam: string | null;
	serviceIdParam: string | null;
	userId: string;
	voicePreset?: VoiceBookingResult | null;
}

export function useAppointmentFormState({
	appointment,
	professionalIdParam,
	serviceIdParam,
	userId,
	voicePreset,
}: UseAppointmentFormStateProps) {
	const [selectedTime, setSelectedTime] = useState<string>("");
	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(serviceIdParam);

	const form = useForm<AppointmentFormValues>({
		resolver: zodResolver(appointmentFormSchema),
		defaultValues: {
			professionalId: appointment?.professionalId ?? professionalIdParam ?? "",
			scheduledAt: appointment ? new Date(appointment.scheduledAt) : undefined,
			reason: appointment?.reason ?? "",
			notes: appointment?.notes ?? "",
			cancellationReason: "",
			userId: userId,
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

	return {
		form,
		selectedTime,
		setSelectedTime,
		selectedServiceId,
		setSelectedServiceId,
	};
}
