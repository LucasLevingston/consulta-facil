"use client";

import { setHours, setMinutes } from "date-fns";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ProfessionalScheduleResponse } from "@/features/schedule";
import type { AppointmentFormValues } from "@/lib/schemas/appointment/appointment-form.schema";
import type { DayOfWeek } from "@/lib/schemas/schedule/days-of-week.schema";
import type { TimeSlot } from "@/lib/types/time-slot";
import { computeSlots } from "@/lib/utils/compute-slots";
import { JS_DAY_TO_DOW } from "@/utils/constants/day-to-dow";
import { useProfessionalAppointments } from "./use-professional-appointments";

interface UseAppointmentSlotsProps {
	professionalId: string;
	selectedDate: Date | undefined;
	selectedService: { durationMinutes?: number } | undefined;
	scheduleList: ProfessionalScheduleResponse[];
	scheduleLoading: boolean;
	form: UseFormReturn<AppointmentFormValues>;
	setSelectedTime: (t: string) => void;
}

export function useAppointmentSlots({
	professionalId,
	selectedDate,
	selectedService,
	scheduleList,
	scheduleLoading,
	form,
	setSelectedTime,
}: UseAppointmentSlotsProps) {
	const { data: professionalAppointmentsPage } = useProfessionalAppointments(
		professionalId,
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
		!!professionalId && !scheduleLoading && scheduleList.length === 0;
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
	return {
		bookedTimesForDate,
		availableSlots,
		isQueueMode,
		isDayDisabled,
		handleTimeSelect,
	};
}
