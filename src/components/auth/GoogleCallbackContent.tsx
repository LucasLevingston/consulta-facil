"use client";

import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth";

export default function GoogleCallbackContent() {
	const router = useRouter();
	const params = useSearchParams();
	const setAuth = useAuthStore((s) => s.setAuth);
	const attempted = useRef(false);

	useEffect(() => {
		if (attempted.current) return;
		attempted.current = true;

		const token = params.get("token");

		if (!token) {
			toast.error("Erro ao entrar com Google.");
			router.replace("/auth/login");
			return;
		}

		setAuth(token);
		Cookies.set("auth_token", token, { expires: 1 });

		toast.success("Login com Google feito com sucesso!");
		router.replace("/dashboard");
	}, [params, router, setAuth]);

	return (
		<div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
			<div className="text-center space-y-6">
				<div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
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
				</div>
				<div className="space-y-1">
					<h2 className="text-xl font-bold text-foreground">Autenticando...</h2>
					<p className="text-sm text-muted-foreground">Aguarde um momento.</p>
				</div>
			</div>
		</div>
	);
}
