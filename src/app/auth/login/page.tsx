"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoginForm } from "@/components/custom/forms/auth/LoginForm";
import { useGoogleLogin } from "@/hooks/api/auth/use-google-login";
import { useLogin } from "@/hooks/api/auth/use-login";
import { useGoogleGIS } from "@/hooks/use-google-gis";
import { type LoginInput, loginSchema } from "@/lib/schemas/auth.schema";
import { cn } from "@/lib/utils";

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

	const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
	const { isAvailable: googleAvailable, signIn: signInWithGoogle } =
		useGoogleGIS(googleClientId, handleGoogleCredential);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

	async function onSubmit(values: LoginInput) {
		try {
			await login.mutateAsync(values);
			toast.success("Login feito com sucesso!");
			router.push("/dashboard");
		} catch {
			toast.error("E-mail ou senha incorretos.");
		}
	}

	const isPending = isSubmitting || login.isPending;

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
				{/* Header */}
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight text-foreground">
						Bem-vindo de volta
					</h2>
					<p className="text-sm text-muted-foreground">
						Entre com sua conta para continuar
					</p>
				</div>

				{/* Social logins */}
				<div className="space-y-3">
					{/* Google */}
					<button
						type="button"
						onClick={googleAvailable ? signInWithGoogle : undefined}
						disabled={!googleAvailable || googleLogin.isPending}
						className={cn(
							"w-full flex items-center justify-center gap-3 px-4 py-2.5",
							"rounded-lg border border-border bg-background",
							"text-sm font-medium text-foreground",
							"transition-colors duration-150",
							"hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							"disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
						)}
						aria-label="Entrar com Google"
					>
						{/* Google logo SVG */}
						<svg
							className="w-4 h-4 shrink-0"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						{googleLogin.isPending ? "Entrando..." : "Continuar com Google"}
					</button>

					{/* Magic Link */}
					<Link
						href="/auth/magic-link"
						className={cn(
							"w-full flex items-center justify-center gap-3 px-4 py-2.5",
							"rounded-lg border border-border bg-background",
							"text-sm font-medium text-foreground",
							"transition-colors duration-150",
							"hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							"cursor-pointer",
						)}
					>
						<svg
							className="w-4 h-4 shrink-0 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
							/>
						</svg>
						Entrar com link no e-mail
					</Link>
				</div>

				{/* Divider */}
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

				<LoginForm onSubmit={onSubmit} isPending={isPending} />

				{/* Register link */}
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
