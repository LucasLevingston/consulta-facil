"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "@/lib/api/schedule.api";
import type {
	ClinicWorkingHoursItem,
	ProfessionalScheduleItem,
} from "@/lib/schemas/schedule.schema";

export const scheduleKeys = {
	all: ["schedule"] as const,
	mySchedule: () => [...scheduleKeys.all, "me"] as const,
	byProfessional: (id: string) => [...scheduleKeys.all, id] as const,
	clinicHours: (clinicId: string) =>
		["clinic-working-hours", clinicId] as const,
};

export function useMySchedule(enabled = true) {
	return useQuery({
		queryKey: scheduleKeys.mySchedule(),
		queryFn: scheduleApi.getMySchedule,
		enabled,
		retry: false,
		staleTime: 1000 * 60 * 10,
	});
}

export function useProfessionalSchedule(professionalId: string) {
	return useQuery({
		queryKey: scheduleKeys.byProfessional(professionalId),
		queryFn: () => scheduleApi.getScheduleByProfessional(professionalId),
		enabled: !!professionalId,
		staleTime: 1000 * 60 * 10,
	});
}

export function useSaveMySchedule() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (items: ProfessionalScheduleItem[]) =>
			scheduleApi.saveMySchedule(items),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scheduleKeys.mySchedule() });
		},
	});
}

export function useClinicWorkingHours(clinicId: string | undefined) {
	return useQuery({
		queryKey: scheduleKeys.clinicHours(clinicId ?? ""),
		queryFn: () => scheduleApi.getClinicWorkingHours(clinicId ?? ""),
		enabled: !!clinicId,
	});
}

export function useSaveClinicWorkingHours(clinicId: string | undefined) {
	const queryClient = useQueryClient();
	const id = clinicId ?? "";
	return useMutation({
		mutationFn: (items: ClinicWorkingHoursItem[]) =>
			scheduleApi.saveClinicWorkingHours(id, items),
		onSuccess: () => {
			if (id) {
				queryClient.invalidateQueries({
					queryKey: scheduleKeys.clinicHours(id),
				});
			}
		},
	});
}
