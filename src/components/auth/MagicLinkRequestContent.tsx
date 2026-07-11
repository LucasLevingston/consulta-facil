"use client";

import Link from "next/link";

import MagicLinkRequestForm from "@/components/forms/auth/MagicLinkRequestForm";
import AuthEmailSentConfirmation from "./AuthEmailSentConfirmation";
import AuthMobileLogo from "./AuthMobileLogo";
import { useMagicLinkRequestForm } from "./use-magic-link-request-form";

export default function MagicLinkRequestContent() {
	const { sentTo, retry, handleSubmit, isPending } = useMagicLinkRequestForm();

	return (
		<div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
			<AuthMobileLogo />
			<div className="w-full max-w-sm space-y-8">
				{sentTo ? (
					<AuthEmailSentConfirmation
						description={
							<>
								Enviamos um link de acesso para{" "}
								<strong className="text-foreground">{sentTo}</strong>.<br />O
								link expira em 15 minutos.
							</>
						}
						onRetry={retry}
					/>
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
							isPending={isPending}
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
