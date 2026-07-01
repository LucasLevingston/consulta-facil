"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ResetPasswordForm from "@/components/forms/auth/ResetPasswordForm";
import { useResetPassword } from "@/features/auth";
import { ResetPasswordInvalidLink } from "./ResetPasswordInvalidLink";
import { ResetPasswordSuccessView } from "./ResetPasswordSuccessView";

export function ResetPasswordContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const router = useRouter();
	const resetPassword = useResetPassword();
	const [done, setDone] = useState(false);

	async function handleSubmit(newPassword: string) {
		if (!token) return;
		try {
			await resetPassword.mutateAsync({ token, newPassword });
			setDone(true);
		} catch {
			toast.error(
				"Link inválido ou expirado. Solicite uma nova redefinição de senha.",
			);
		}
	}

	if (!token) return <ResetPasswordInvalidLink />;

	return (
		<div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
			<div className="lg:hidden flex items-center gap-2 mb-10">
				<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
					<svg
						className="w-4 h-4 text-primary-foreground"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.5 12.75l6 6 9-13.5"
						/>
					</svg>
				</div>
				<span className="font-bold text-lg text-foreground">
					Consulta Fácil
				</span>
			</div>
			<div className="w-full max-w-sm space-y-8">
				{done ? (
					<ResetPasswordSuccessView
						onGoToLogin={() => router.push("/auth/login")}
					/>
				) : (
					<>
						<div className="space-y-2">
							<h2 className="text-2xl font-bold tracking-tight text-foreground">
								Criar nova senha
							</h2>
							<p className="text-sm text-muted-foreground">
								Digite e confirme sua nova senha.
							</p>
						</div>
						<ResetPasswordForm
							onSubmit={handleSubmit}
							isPending={resetPassword.isPending}
						/>
					</>
				)}
				<div className="text-center">
					<a
						href="/auth/login"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
					>
						<svg
							className="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
							/>
						</svg>
						Voltar para o login
					</a>
				</div>
			</div>
		</div>
	);
}
