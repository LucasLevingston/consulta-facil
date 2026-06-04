"use client";

import { useMutation } from "@tanstack/react-query";

import { registerApi } from "@/lib/api/auth/register.api";
import type { RegisterInput } from "@/lib/schemas/auth.schema";

export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterInput) => registerApi(data),
	});
}
