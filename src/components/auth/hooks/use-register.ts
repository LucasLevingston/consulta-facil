"use client";

import { useMutation } from "@tanstack/react-query";
import { authRepository } from "@/features/auth";
import type { RegisterInput } from "@/lib/schemas/auth/register.schema";

export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterInput) => authRepository.register(data),
	});
}
