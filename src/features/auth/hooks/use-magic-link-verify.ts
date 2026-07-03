"use client";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth.store";
import { authRepository } from "../repositories/auth.repository";

export function useMagicLinkVerify() {
	const setAuth = useAuthStore((s) => s.setAuth);
	return useMutation({
		mutationFn: (token: string) => authRepository.magicLinkVerify(token),
		onSuccess: (data) => {
			setAuth(data.token);
			Cookies.set("auth_token", data.token, {
				expires: (data.expiresIn ?? 86400) / 86400,
			});
		},
	});
}
