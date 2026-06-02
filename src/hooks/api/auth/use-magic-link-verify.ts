"use client";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { magicLinkVerifyApi } from "@/lib/api/auth/magic-link-verify.api";
import { useAuthStore } from "@/store/auth.store";

export function useMagicLinkVerify() {
	const setAuth = useAuthStore((s) => s.setAuth);

	return useMutation({
		mutationFn: (token: string) => magicLinkVerifyApi(token),
		onSuccess: (data) => {
			setAuth(data.token);
			Cookies.set("auth_token", data.token, {
				expires: (data.expiresIn ?? 86400) / 86400,
			});
		},
	});
}
