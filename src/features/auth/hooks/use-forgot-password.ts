"use client";

import { useMutation } from "@tanstack/react-query";
import { authRepository } from "../repositories/auth.repository";

export function useForgotPassword() {
	return useMutation({
		mutationFn: (email: string) => authRepository.forgotPassword(email),
	});
}
