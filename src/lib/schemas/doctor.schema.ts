import { z } from "zod";

export const doctorResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  specialty: z.string(),
  licenseNumber: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

export const createDoctorSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  specialty: z
    .string()
    .min(3, "Especialidade deve ter pelo menos 3 caracteres")
    .max(100),
  licenseNumber: z
    .string()
    .min(5, "Número de registro deve ter pelo menos 5 caracteres")
    .max(50),
});

export type DoctorResponse = z.infer<typeof doctorResponseSchema>;
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type ApiPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
};
