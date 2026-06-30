"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import LoginForm from "@/components/forms/auth/LoginForm";
import SocialAuthButtons from "@/components/forms/auth/SocialAuthButtons";
import type { LoginInput } from "@/features/auth";
import { useGoogleLogin, useLogin } from "@/features/auth";
import { useGoogleGIS } from "@/hooks/use-google-gis";

export default function LoginPage() {
	const router = useRouter();
	const login = useLogin();
	const googleLogin = useGoogleLogin();

	const handleGoogleCredential = useCallback(
		async (idToken: string) => {
			try {
				await googleLogin.mutateAsync(idToken);
				toast.success("Login com Google feito com sucesso!");
				router.push("/dashboard");
			} catch {
				toast.error("Erro ao entrar com Google.");
			}
		},
		[googleLogin, router],
	);

	const { isAvailable: googleAvailable, signIn: signInWithGoogle } =
		useGoogleGIS(
			process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
			handleGoogleCredential,
		);

	async function handleLoginSubmit(values: LoginInput) {
		try {
			await login.mutateAsync(values);
			toast.success("Login feito com sucesso!");
			router.push("/dashboard");
		} catch {
			toast.error("E-mail ou senha incorretos.");
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
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight text-foreground">
						Bem-vindo de volta
					</h2>
					<p className="text-sm text-muted-foreground">
						Entre com sua conta para continuar
					</p>
				</div>

				<SocialAuthButtons
					onGoogleClick={signInWithGoogle}
					googleDisabled={!googleAvailable}
					googleLoading={googleLogin.isPending}
				/>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-border" />
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="bg-background px-3 text-muted-foreground">
							ou continue com e-mail
						</span>
					</div>
				</div>

				<LoginForm onSubmit={handleLoginSubmit} isPending={login.isPending} />

				<div className="text-right -mt-4">
					<Link
						href="/auth/forgot-password"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Esqueceu sua senha?
					</Link>
				</div>

				<p className="text-center text-sm text-muted-foreground">
					Não tem uma conta?{" "}
					<Link
						href="/auth/register"
						className="text-primary font-medium hover:underline"
					>
						Criar conta grátis
					</Link>
				</p>
			</div>
		</div>
	);
}
