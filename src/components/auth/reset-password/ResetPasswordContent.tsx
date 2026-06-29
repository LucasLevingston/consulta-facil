"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ResetPasswordForm from "@/components/forms/auth/ResetPasswordForm";
import { useResetPassword } from "@/features/auth";

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

	if (!token) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
				<div className="w-full max-w-sm space-y-6 text-center">
					<h2 className="text-2xl font-bold text-foreground">Link inválido</h2>
					<p className="text-sm text-muted-foreground">
						Este link de redefinição é inválido ou expirou.
					</p>
					<Link
						href="/auth/forgot-password"
						className="text-primary font-medium hover:underline text-sm"
					>
						Solicitar novo link
					</Link>
				</div>
			</div>
		);
	}

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
					<div className="text-center space-y-6">
						<div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
							<svg
								className="w-8 h-8 text-primary"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
						</div>
						<div className="space-y-2">
							<h2 className="text-2xl font-bold text-foreground">
								Senha redefinida!
							</h2>
							<p className="text-sm text-muted-foreground">
								Sua senha foi alterada com sucesso.
							</p>
						</div>
						<button
							type="button"
							onClick={() => router.push("/auth/login")}
							className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
						>
							Ir para o login
						</button>
					</div>
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
					<Link
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
					</Link>
				</div>
			</div>
		</div>
	);
}
