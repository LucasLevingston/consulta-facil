"use client";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth.store";
import { authRepository } from "../repositories/auth.repository";

export function useGoogleLogin() {
	const setAuth = useAuthStore((s) => s.setAuth);
	return useMutation({
		mutationFn: (idToken: string) => authRepository.googleLogin(idToken),
		onSuccess: (data) => {
			setAuth(data.token);
			Cookies.set("auth_token", data.token, {
				expires: (data.expiresIn ?? 86400) / 86400,
			});
		},
	});
}
