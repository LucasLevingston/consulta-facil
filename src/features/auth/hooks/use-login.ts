"use client";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import type { LoginInput } from "@/lib/schemas/auth/login.schema";
import { useAuthStore } from "@/store/auth.store";
import { authRepository } from "../repositories/auth.repository";

export function useLogin() {
	const setAuth = useAuthStore((s) => s.setAuth);
	return useMutation({
		mutationFn: (data: LoginInput) => authRepository.login(data),
		onSuccess: (data) => {
			setAuth(data.token);
			Cookies.set("auth_token", data.token, {
				expires: (data.expiresIn ?? 86400) / 86400,
			});
		},
	});
}
