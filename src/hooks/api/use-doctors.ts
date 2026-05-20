"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { professionalsApi } from "@/lib/api/doctors.api";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor.schema";

export const professionalKeys = {
	all: ["professionals"] as const,
	list: (page?: number, size?: number) =>
		[...professionalKeys.all, "list", { page, size }] as const,
	search: (specialty: string) =>
		[...professionalKeys.all, "search", specialty] as const,
	detail: (id: string) => [...professionalKeys.all, id] as const,
	nearby: (lat: number, lng: number, radiusKm: number, specialty?: string) =>
		[
			...professionalKeys.all,
			"nearby",
			{ lat, lng, radiusKm, specialty },
		] as const,
};

// Backwards-compatible alias
export const doctorKeys = professionalKeys;

export function useProfessionals(page = 0, size = 20) {
	return useQuery({
		queryKey: professionalKeys.list(page, size),
		queryFn: () => professionalsApi.getAll(page, size),
	});
}

export function useProfessional(id: string) {
	return useQuery({
		queryKey: professionalKeys.detail(id),
		queryFn: () => professionalsApi.getById(id),
		enabled: !!id,
	});
}

export function useSearchProfessionals(specialty: string) {
	return useQuery({
		queryKey: professionalKeys.search(specialty),
		queryFn: () => professionalsApi.searchBySpecialty(specialty),
		enabled: !!specialty,
	});
}

export function useCreateProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProfessionalInput) =>
			professionalsApi.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}

export function useUpdateProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			professionalId,
			data,
		}: {
			professionalId: string;
			data: CreateProfessionalInput;
		}) => professionalsApi.update(professionalId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}

export function useDeleteProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalsApi.delete(professionalId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}

export const applicationKeys = {
	all: ["professional-applications"] as const,
	status: () => [...applicationKeys.all, "status"] as const,
};

export function usePendingApplications(page = 0, size = 20) {
	return useQuery({
		queryKey: [...applicationKeys.all, "list", { page, size }],
		queryFn: () => professionalsApi.getPendingApplications(page, size),
	});
}

export function useApplicationStatus() {
	return useQuery({
		queryKey: applicationKeys.status(),
		queryFn: () => professionalsApi.getApplicationStatus(),
		retry: false,
	});
}

export function useApproveApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalsApi.approve(professionalId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: applicationKeys.all });
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}

export function useRejectApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalsApi.reject(professionalId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: applicationKeys.all });
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}

export function useProfessionalsNearby(
	lat: number | null,
	lng: number | null,
	radiusKm = 50,
	specialty?: string,
) {
	return useQuery({
		queryKey: professionalKeys.nearby(lat ?? 0, lng ?? 0, radiusKm, specialty),
		queryFn: () =>
			professionalsApi.getNearby(lat ?? 0, lng ?? 0, radiusKm, specialty),
		enabled: lat !== null && lng !== null,
	});
}

// Backwards-compatible aliases
export const useDoctors = useProfessionals;
export const useDoctor = useProfessional;
export const useSearchDoctors = useSearchProfessionals;
export const useCreateDoctor = useCreateProfessional;
export const useUpdateDoctor = useUpdateProfessional;
export const useDeleteDoctor = useDeleteProfessional;
export const useDoctorsNearby = useProfessionalsNearby;
