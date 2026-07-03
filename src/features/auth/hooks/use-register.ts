"use client";

import { useMutation } from "@tanstack/react-query";
import type { RegisterInput } from "@/lib/schemas/auth/register.schema";
import { authRepository } from "../repositories/auth.repository";

export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterInput) => authRepository.register(data),
	});
}
