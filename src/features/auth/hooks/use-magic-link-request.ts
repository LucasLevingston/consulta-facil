"use client";

import { useMutation } from "@tanstack/react-query";
import { authRepository } from "../repositories/auth.repository";

export function useMagicLinkRequest() {
	return useMutation({
		mutationFn: (email: string) => authRepository.magicLinkRequest(email),
	});
}
