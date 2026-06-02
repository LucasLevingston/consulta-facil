"use client";

import { useMutation } from "@tanstack/react-query";
import { magicLinkRequestApi } from "@/lib/api/auth/magic-link-request.api";

export function useMagicLinkRequest() {
	return useMutation({
		mutationFn: (email: string) => magicLinkRequestApi(email),
	});
}
