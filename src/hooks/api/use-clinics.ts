"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { clinicsApi } from "@/lib/api/clinics.api";
import type { CreateClinicInput, InviteReceptionistInput } from "@/lib/schemas/clinic.schema";

export const clinicKeys = {
	all: ["clinics"] as const,
	list: () => [...clinicKeys.all, "list"] as const,
	my: () => [...clinicKeys.all, "my"] as const,
	detail: (id: string) => [...clinicKeys.all, id] as const,
	nearby: (lat: number, lng: number, radiusKm: number) =>
		[...clinicKeys.all, "nearby", { lat, lng, radiusKm }] as const,
	receptionists: (clinicId: string) => [...clinicKeys.all, clinicId, "receptionists"] as const,
};

export function useClinics() {
	return useQuery({
		queryKey: clinicKeys.list(),
		queryFn: () => clinicsApi.getAll(),
	});
}

export function useMyClinic() {
	return useQuery({
		queryKey: clinicKeys.my(),
		queryFn: () => clinicsApi.getMy(),
	});
}

export function useClinicById(id: string) {
	return useQuery({
		queryKey: clinicKeys.detail(id),
		queryFn: () => clinicsApi.getById(id),
		enabled: !!id,
	});
}

export function useClinicsNearby(
	lat: number | null,
	lng: number | null,
	radiusKm = 50,
) {
	return useQuery({
		queryKey: clinicKeys.nearby(lat ?? 0, lng ?? 0, radiusKm),
		queryFn: () => clinicsApi.getNearby(lat ?? 0, lng ?? 0, radiusKm),
		enabled: lat !== null && lng !== null,
	});
}

export function useCreateClinic() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateClinicInput) => clinicsApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}

export function useUpdateClinic() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CreateClinicInput }) =>
			clinicsApi.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}

export function useAddClinicMember() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			clinicId,
			professionalProfileId,
		}: {
			clinicId: string;
			professionalProfileId: string;
		}) => clinicsApi.addMember(clinicId, professionalProfileId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}

export function useRemoveClinicMember() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			clinicId,
			professionalProfileId,
		}: {
			clinicId: string;
			professionalProfileId: string;
		}) => clinicsApi.removeMember(clinicId, professionalProfileId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}

export function useClinicReceptionists(clinicId: string) {
	return useQuery({
		queryKey: clinicKeys.receptionists(clinicId),
		queryFn: () => clinicsApi.getReceptionists(clinicId),
		enabled: !!clinicId,
	});
}

export function useInviteReceptionist(clinicId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: InviteReceptionistInput) =>
			clinicsApi.inviteReceptionist(clinicId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.receptionists(clinicId) });
		},
	});
}

export function useRemoveReceptionist(clinicId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (receptionistId: string) =>
			clinicsApi.removeReceptionist(clinicId, receptionistId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.receptionists(clinicId) });
		},
	});
}
