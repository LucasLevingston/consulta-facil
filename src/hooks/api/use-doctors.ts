"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { doctorsApi } from "@/lib/api/doctors.api";
import type { CreateDoctorInput } from "@/lib/schemas/doctor.schema";

export const doctorKeys = {
  all: ["doctors"] as const,
  list: (page?: number, size?: number) =>
    [...doctorKeys.all, "list", { page, size }] as const,
  search: (specialty: string) => [...doctorKeys.all, "search", specialty] as const,
  detail: (id: string) => [...doctorKeys.all, id] as const,
};

export function useDoctors(page = 0, size = 20) {
  return useQuery({
    queryKey: doctorKeys.list(page, size),
    queryFn: () => doctorsApi.getAll(page, size),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorsApi.getById(id),
    enabled: !!id,
  });
}

export function useSearchDoctors(specialty: string) {
  return useQuery({
    queryKey: doctorKeys.search(specialty),
    queryFn: () => doctorsApi.searchBySpecialty(specialty),
    enabled: !!specialty,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDoctorInput) => doctorsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, data }: { doctorId: string; data: CreateDoctorInput }) =>
      doctorsApi.update(doctorId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorId: string) => doctorsApi.delete(doctorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
  });
}
