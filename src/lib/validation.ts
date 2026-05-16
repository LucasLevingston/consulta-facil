import { z } from "zod";

export const UserFormValidation = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  phone: z.string().min(1, "Número de telefone é obrigatório"),
  role: z.enum(["doctor", "patient"], {
    required_error: "Por favor selecione um tipo",
  }),
});
export const LoginFormValidation = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});
