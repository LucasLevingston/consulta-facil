"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/api/auth/use-login";
import { useRegister } from "@/hooks/api/auth/use-register";
import { type RegisterInput, registerSchema } from "@/lib/schemas/auth.schema";

export default function RegisterPage() {
	const router = useRouter();
	const register = useRegister();
	const login = useLogin();

	const {
		register: field,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

	async function onSubmit(data: RegisterInput) {
		try {
			await register.mutateAsync(data);
			await login.mutateAsync({ email: data.email, password: data.password });
			toast.success("Conta criada com sucesso!");
			router.push("/auth/completar-cadastro");
		} catch {
			toast.error("Erro ao criar conta. Tente novamente.");
		}
	}

	const isPending = isSubmitting || register.isPending || login.isPending;

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
						Criar conta
					</h2>
					<p className="text-sm text-muted-foreground">
						Comece gratuitamente, sem cartão de crédito
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4"
					noValidate
				>
					{/* Name + CPF row */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="name">Nome completo</Label>
							<Input
								id="name"
								autoComplete="name"
								placeholder="João Silva"
								aria-invalid={!!errors.name}
								{...field("name")}
							/>
							{errors.name && (
								<p className="text-xs text-destructive" role="alert">
									{errors.name.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="cpf">CPF</Label>
							<Input
								id="cpf"
								placeholder="000.000.000-00"
								aria-invalid={!!errors.cpf}
								{...field("cpf")}
							/>
							{errors.cpf && (
								<p className="text-xs text-destructive" role="alert">
									{errors.cpf.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="email">E-mail</Label>
						<Input
							id="email"
							type="email"
							autoComplete="email"
							placeholder="seu@email.com"
							aria-invalid={!!errors.email}
							{...field("email")}
						/>
						{errors.email && (
							<p className="text-xs text-destructive" role="alert">
								{errors.email.message}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="password">Senha</Label>
						<Input
							id="password"
							type="password"
							autoComplete="new-password"
							placeholder="Mínimo 8 caracteres"
							aria-invalid={!!errors.password}
							{...field("password")}
						/>
						{errors.password && (
							<p className="text-xs text-destructive" role="alert">
								{errors.password.message}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="confirmPassword">Confirmar senha</Label>
						<Input
							id="confirmPassword"
							type="password"
							autoComplete="new-password"
							placeholder="Repita a senha"
							aria-invalid={!!errors.confirmPassword}
							{...field("confirmPassword")}
						/>
						{errors.confirmPassword && (
							<p className="text-xs text-destructive" role="alert">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isPending}
						aria-busy={isPending}
					>
						{isPending ? (
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
								Criando conta...
							</span>
						) : (
							"Criar conta"
						)}
					</Button>
				</form>

				<p className="text-center text-sm text-muted-foreground">
					Já tem uma conta?{" "}
					<Link
						href="/auth/login"
						className="text-primary font-medium hover:underline"
					>
						Entrar
					</Link>
				</p>
			</div>
		</div>
	);
}
