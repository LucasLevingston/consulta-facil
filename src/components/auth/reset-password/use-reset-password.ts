"use client";

import { useMutation } from "@tanstack/react-query";
import { authRepository } from "@/features/auth";

export function useResetPassword() {
	return useMutation({
		mutationFn: ({
			token,
			newPassword,
		}: {
			token: string;
			newPassword: string;
		}) => authRepository.resetPassword(token, newPassword),
	});
}
