"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { patientsApi, type DoctorPatientsParams } from "@/lib/api/patients.api";

export const patientKeys = {
  all: ["patients"] as const,
  me: () => [...patientKeys.all, "me"] as const,
  detail: (userId: string) => [...patientKeys.all, userId] as const,
  medicalRecords: (userId: string) =>
    [...patientKeys.all, userId, "medical-records"] as const,
};

export function useMyProfile(enabled = true) {
  return useQuery({
    queryKey: patientKeys.me(),
    queryFn: patientsApi.getMyProfile,
    enabled,
  });
}

export function usePatientProfile(userId: string) {
  return useQuery({
    queryKey: patientKeys.detail(userId),
    queryFn: () => patientsApi.getProfile(userId),
    enabled: !!userId,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => patientsApi.updateMyProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.me() }),
  });
}

export function useMedicalRecords(userId: string) {
  return useQuery({
    queryKey: patientKeys.medicalRecords(userId),
    queryFn: () => patientsApi.getMedicalRecords(userId),
    enabled: !!userId,
  });
}

export function useUpdateMedicalRecords(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      patientsApi.updateMedicalRecords(userId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: patientKeys.medicalRecords(userId) }),
  });
}

export function useDoctorPatients(doctorId: string, params: DoctorPatientsParams) {
  return useQuery({
    queryKey: [...patientKeys.all, "doctor", doctorId, params],
    queryFn: () => patientsApi.getDoctorPatients(doctorId, params),
    enabled: !!doctorId,
  });
}
