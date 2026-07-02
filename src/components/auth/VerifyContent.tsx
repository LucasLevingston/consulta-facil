"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMagicLinkVerify } from "@/features/auth";
import { VerifyStatusIcon } from "./VerifyStatusIcon";

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
			<div className="space-y-6 text-center">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
					<VerifyStatusIcon
						isLoading={isLoading}
						isSuccess={verify.isSuccess}
					/>
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
