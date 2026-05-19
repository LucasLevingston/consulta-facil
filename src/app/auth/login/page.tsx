"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LoginForm } from "@/components/custom/forms/auth/LoginForm";
import { Logo } from "@/components/logo";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/api/auth/use-login";
import type { LoginInput } from "@/lib/schemas/auth.schema";

export default function LoginPage() {
	const router = useRouter();
	const login = useLogin();

	async function handleSubmit(values: LoginInput) {
		try {
			await login.mutateAsync(values);
			toast.success("Login feito com sucesso!");
			router.push("/dashboard");
		} catch {
			toast.error("E-mail ou senha incorretos.");
		}
	}

	return (
		<div className="flex-1 flex flex-col items-center justify-center">
			<Logo className="mb-8" />
			<Card>
				<CardHeader>
					<CardTitle>Entrar</CardTitle>
					<CardDescription>Bem-vindo de volta ao Consulta Fácil</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm onSubmit={handleSubmit} isPending={login.isPending} />
				</CardContent>
			</Card>
		</div>
	);
}
