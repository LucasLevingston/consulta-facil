"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForgotPassword } from "./use-forgot-password";

export function useForgotPasswordForm() {
	const [sentTo, setSentTo] = useState<string | null>(null);
	const forgotPassword = useForgotPassword();

	async function handleSubmit(email: string) {
		try {
			await forgotPassword.mutateAsync(email);
			setSentTo(email);
		} catch {
			toast.error("Erro ao enviar e-mail. Tente novamente.");
		}
	}

	return {
		sentTo,
		retry: () => setSentTo(null),
		handleSubmit,
		isPending: forgotPassword.isPending,
	};
}
