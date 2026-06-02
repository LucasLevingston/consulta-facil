"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginInput, loginSchema } from "@/lib/schemas/auth.schema";

interface LoginFormProps {
	onSubmit: (values: LoginInput) => Promise<void>;
	isPending: boolean;
}

export default function LoginForm({ onSubmit, isPending }: LoginFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
			<div className="space-y-1.5">
				<Label htmlFor="email">E-mail</Label>
				<Input
					id="email"
					type="email"
					autoComplete="email"
					placeholder="seu@email.com"
					aria-invalid={!!errors.email}
					aria-describedby={errors.email ? "login-email-error" : undefined}
					{...register("email")}
				/>
				{errors.email && (
					<p
						id="login-email-error"
						className="text-xs text-destructive"
						role="alert"
					>
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<Label htmlFor="password">Senha</Label>
					<Link
						href="/auth/forgot-password"
						className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
					>
						Esqueci minha senha
					</Link>
				</div>
				<Input
					id="password"
					type="password"
					autoComplete="current-password"
					placeholder="••••••••"
					aria-invalid={!!errors.password}
					aria-describedby={
						errors.password ? "login-password-error" : undefined
					}
					{...register("password")}
				/>
				{errors.password && (
					<p
						id="login-password-error"
						className="text-xs text-destructive"
						role="alert"
					>
						{errors.password.message}
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
						Entrando...
					</span>
				) : (
					"Entrar"
				)}
			</Button>
		</form>
	);
}
