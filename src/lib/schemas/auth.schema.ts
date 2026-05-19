import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(150),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres").max(256),
  confirmPassword: z.string().min(8, "Senha deve ter pelo menos 8 caracteres").max(256),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos")
    .or(z.literal("")),
  phone: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  type: z.string(),
  expiresIn: z.number(),
  userId: z.string(),
  email: z.string(),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]),
});

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]),
  phone: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
