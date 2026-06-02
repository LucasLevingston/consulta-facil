"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMagicLinkRequest } from "@/hooks/api/auth/use-magic-link-request";

export default function MagicLinkPage() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const request = useMagicLinkRequest();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email.trim()) return;

		try {
			await request.mutateAsync(email.trim().toLowerCase());
			setSent(true);
		} catch {
			toast.error("Erro ao enviar o link. Tente novamente.");
		}
	}

	return (
		<div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
			{/* Mobile logo */}
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
				{sent ? (
					/* Success state */
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
								<strong className="text-foreground">{email}</strong>.
								<br />O link expira em 15 minutos.
							</p>
						</div>
						<p className="text-xs text-muted-foreground">
							Não recebeu?{" "}
							<button
								type="button"
								onClick={() => setSent(false)}
								className="text-primary hover:underline cursor-pointer"
							>
								Tentar novamente
							</button>
						</p>
					</div>
				) : (
					/* Form state */
					<>
						<div className="space-y-2">
							<h2 className="text-2xl font-bold tracking-tight text-foreground">
								Link de acesso
							</h2>
							<p className="text-sm text-muted-foreground">
								Digite seu e-mail e enviaremos um link para entrar sem senha.
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4" noValidate>
							<div className="space-y-1.5">
								<Label htmlFor="email">E-mail</Label>
								<Input
									id="email"
									type="email"
									autoComplete="email"
									placeholder="seu@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={request.isPending || !email.trim()}
								aria-busy={request.isPending}
							>
								{request.isPending ? (
									<span className="flex items-center gap-2">
										<svg
											className="w-4 h-4 animate-spin"
											fill="none"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
											/>
										</svg>
										Enviando...
									</span>
								) : (
									"Enviar link de acesso"
								)}
							</Button>
						</form>
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
