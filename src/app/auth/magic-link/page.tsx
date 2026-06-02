"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import MagicLinkRequestForm from "@/components/custom/forms/auth/MagicLinkRequestForm";
import { useMagicLinkRequest } from "@/hooks/api/auth/use-magic-link-request";

export default function MagicLinkPage() {
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
				{sentTo ? (
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
									d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
								/>
							</svg>
						</div>
						<div className="space-y-2">
							<h2 className="text-2xl font-bold text-foreground">
								Verifique seu e-mail
							</h2>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Enviamos um link de acesso para{" "}
								<strong className="text-foreground">{sentTo}</strong>.<br />O
								link expira em 15 minutos.
							</p>
						</div>
						<p className="text-xs text-muted-foreground">
							Não recebeu?{" "}
							<button
								type="button"
								onClick={() => setSentTo(null)}
								className="text-primary hover:underline cursor-pointer"
							>
								Tentar novamente
							</button>
						</p>
					</div>
				) : (
					<>
						<div className="space-y-2">
							<h2 className="text-2xl font-bold tracking-tight text-foreground">
								Link de acesso
							</h2>
							<p className="text-sm text-muted-foreground">
								Digite seu e-mail e enviaremos um link para entrar sem senha.
							</p>
						</div>
						<MagicLinkRequestForm
							onSubmit={handleSubmit}
							isPending={request.isPending}
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
