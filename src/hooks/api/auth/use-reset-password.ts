"use client";

import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "@/lib/api/auth/reset-password.api";

export function useResetPassword() {
	return useMutation({
		mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
			resetPasswordApi(token, newPassword),
	});
}
