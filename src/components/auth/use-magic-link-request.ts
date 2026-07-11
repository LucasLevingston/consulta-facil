"use client";

import { useMutation } from "@tanstack/react-query";
import { authRepository } from "@/features/auth";

export function useMagicLinkRequest() {
	return useMutation({
		mutationFn: (email: string) => authRepository.magicLinkRequest(email),
	});
}
