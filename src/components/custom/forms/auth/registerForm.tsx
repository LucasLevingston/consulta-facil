"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type RegisterInput, registerSchema } from "@/lib/schemas/auth.schema";

interface RegisterFormProps {
	onSubmit: (data: RegisterInput) => Promise<void>;
	isPending: boolean;
}

export function RegisterForm({ onSubmit, isPending }: RegisterFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label htmlFor="name">Nome completo</Label>
					<Input
						id="name"
						autoComplete="name"
						placeholder="João Silva"
						aria-invalid={!!errors.name}
						{...register("name")}
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
						{...register("cpf")}
					/>
					{errors.cpf && (
						<p className="text-xs text-destructive" role="alert">
							{errors.cpf.message}
						</p>
					)}
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="reg-email">E-mail</Label>
				<Input
					id="reg-email"
					type="email"
					autoComplete="email"
					placeholder="seu@email.com"
					aria-invalid={!!errors.email}
					{...register("email")}
				/>
				{errors.email && (
					<p className="text-xs text-destructive" role="alert">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="reg-password">Senha</Label>
				<Input
					id="reg-password"
					type="password"
					autoComplete="new-password"
					placeholder="Mínimo 8 caracteres"
					aria-invalid={!!errors.password}
					{...register("password")}
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
					{...register("confirmPassword")}
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

			<p className="text-center text-sm text-muted-foreground">
				Já tem uma conta?{" "}
				<Link
					href="/auth/login"
					className="text-primary font-medium hover:underline"
				>
					Entrar
				</Link>
			</p>
		</form>
	);
}
