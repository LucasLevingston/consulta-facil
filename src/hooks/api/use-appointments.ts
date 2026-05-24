"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import type {
	CancelAppointmentInput,
	CreateAppointmentInput,
	RateAppointmentInput,
	RescheduleAppointmentInput,
	SetModalityInput,
} from "@/lib/schemas/appointment.schema";

export const appointmentKeys = {
	all: ["appointments"] as const,
	byPatient: (userId: string) =>
		[...appointmentKeys.all, "patient", userId] as const,
	byProfessional: (professionalId: string) =>
		[...appointmentKeys.all, "professional", professionalId] as const,
	detail: (id: string) => [...appointmentKeys.all, id] as const,
};

export function usePatientAppointments(userId: string, page = 0, size = 50) {
	return useQuery({
		queryKey: appointmentKeys.byPatient(userId),
		queryFn: () => appointmentsApi.getByPatient(userId, page, size),
		enabled: !!userId,
	});
}

export function useProfessionalAppointments(
	professionalId: string,
	page = 0,
	size = 50,
) {
	return useQuery({
		queryKey: appointmentKeys.byProfessional(professionalId),
		queryFn: () =>
			appointmentsApi.getByProfessional(professionalId, page, size),
		enabled: !!professionalId,
	});
}

export function useAppointment(id: string) {
	return useQuery({
		queryKey: appointmentKeys.detail(id),
		queryFn: () => appointmentsApi.getById(id),
		enabled: !!id,
	});
}

export function useScheduleAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateAppointmentInput) =>
			appointmentsApi.schedule(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}

export function useCancelAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CancelAppointmentInput }) =>
			appointmentsApi.cancel(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}

export function useConfirmAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentsApi.confirm(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}

export function useCompleteAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentsApi.complete(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}

export function useRateAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RateAppointmentInput }) =>
			appointmentsApi.rate(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
			queryClient.invalidateQueries({ queryKey: ["professionals"] });
		},
	});
}

export function useRescheduleAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: RescheduleAppointmentInput;
		}) => appointmentsApi.reschedule(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}

export function useDeleteAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentsApi.delete(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}

export const queueKeys = {
	queue: ["appointments", "queue"] as const,
};

export function useCheckInToken(appointmentId: string) {
	return useQuery({
		queryKey: [...appointmentKeys.detail(appointmentId), "checkin-token"],
		queryFn: () => appointmentsApi.getCheckInToken(appointmentId),
		enabled: !!appointmentId,
	});
}

export function useCheckInByQr() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (token: string) => appointmentsApi.checkInByQr(token),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}

export function useQueue() {
	return useQuery({
		queryKey: queueKeys.queue,
		queryFn: () => appointmentsApi.getQueue(),
		refetchInterval: 30_000,
	});
}

export function useCallPatient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (appointmentId: string) => appointmentsApi.callPatient(appointmentId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queueKeys.queue }),
	});
}

export function useSetModality() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: SetModalityInput }) =>
			appointmentsApi.setModality(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}

export function useGenerateMeetLink() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentsApi.generateMeetLink(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}

export function useCreatePayment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			appointmentId,
			amount,
		}: {
			appointmentId: string;
			amount?: number;
		}) => appointmentsApi.createPayment(appointmentId, amount),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
