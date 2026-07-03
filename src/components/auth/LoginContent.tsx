"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import LoginForm from "@/components/forms/auth/LoginForm";
import SocialAuthButtons from "@/components/forms/auth/SocialAuthButtons";
import { env } from "@/env";
import type { LoginInput } from "@/features/auth";
import { useLogin } from "@/features/auth";
import AuthMobileLogo from "./AuthMobileLogo";

export default function LoginContent() {
	const router = useRouter();
	const login = useLogin();

	function signInWithGoogle() {
		window.location.href = `${env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
	}

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
			<AuthMobileLogo />
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
					googleDisabled={false}
					googleLoading={false}
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
