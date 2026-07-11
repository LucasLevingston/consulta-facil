"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMagicLinkRequest } from "./use-magic-link-request";

export function useMagicLinkRequestForm() {
	const [sentTo, setSentTo] = useState<string | null>(null);
	const request = useMagicLinkRequest();

	async function handleSubmit(email: string) {
		try {
			await request.mutateAsync(email);
			setSentTo(email);
		} catch {
			toast.error("Erro ao enviar o link. Tente novamente.");
		}
	}

	return {
		sentTo,
		retry: () => setSentTo(null),
		handleSubmit,
		isPending: request.isPending,
	};
}
