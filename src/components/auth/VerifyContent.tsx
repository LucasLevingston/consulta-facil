"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useMagicLinkVerify } from "@/features/auth";

export default function VerifyContent() {
	const router = useRouter();
	const params = useSearchParams();
	const token = params.get("token");
	const verify = useMagicLinkVerify();
	const attempted = useRef(false);
	const mutateAsync = verify.mutateAsync;

	useEffect(() => {
		if (attempted.current || !token) return;
		attempted.current = true;

		mutateAsync(token)
			.then(() => {
				toast.success("Login feito com sucesso!");
				router.replace("/dashboard");
			})
			.catch(() => {
				toast.error("Link inválido ou expirado.");
				router.replace("/auth/magic-link");
			});
	}, [token, mutateAsync, router]);

	const isLoading = verify.isPending || (!verify.isError && !verify.isSuccess);

	return (
		<div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
			<div className="text-center space-y-6">
				<div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
					{isLoading ? (
						<svg
							className="w-7 h-7 text-primary animate-spin"
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
					) : verify.isSuccess ? (
						<svg
							className="w-7 h-7 text-green-500"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.5 12.75l6 6 9-13.5"
							/>
						</svg>
					) : (
						<svg
							className="w-7 h-7 text-destructive"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
					)}
				</div>

				<div className="space-y-1">
					<h2 className="text-xl font-bold text-foreground">
						{isLoading
							? "Verificando link..."
							: verify.isSuccess
								? "Autenticado!"
								: "Link inválido"}
					</h2>
					<p className="text-sm text-muted-foreground">
						{isLoading
							? "Aguarde um momento..."
							: verify.isSuccess
								? "Redirecionando para o dashboard..."
								: "Redirecionando..."}
					</p>
				</div>
			</div>
		</div>
	);
}
