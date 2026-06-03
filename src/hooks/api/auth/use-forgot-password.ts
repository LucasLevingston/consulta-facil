"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "@/lib/api/auth/forgot-password.api";

export function useForgotPassword() {
	return useMutation({
		mutationFn: (email: string) => forgotPasswordApi(email),
	});
}
