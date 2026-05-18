"use client";

import { useRouter } from "next/navigation";

import { RegisterForm } from "@/components/custom/forms/auth/registerForm";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin } from "@/hooks/api/auth/use-login";
import { useRegister } from "@/hooks/api/auth/use-register";
import { toast } from "@/hooks/use-toast";
import type { RegisterInput } from "@/lib/schemas/auth.schema";

export default function RegisterPage() {
	const router = useRouter();
	const register = useRegister();
	const login = useLogin();

	async function handleSubmit(data: RegisterInput) {
		try {
			await register.mutateAsync(data);
			await login.mutateAsync({ email: data.email, password: data.password });
			toast({ title: "Usuário registrado com sucesso!" });
			router.push("/auth/completar-cadastro");
		} catch {
			toast({
				title: "Erro ao registrar usuário. Tente novamente.",
				variant: "destructive",
			});
		}
	}

	return (
		<div className="flex-1 flex flex-col items-center justify-center">
			<Logo className="mb-8" />
			<Card>
				<CardHeader>
					<CardTitle>Cadastro</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisterForm
						onSubmit={handleSubmit}
						isPending={register.isPending || login.isPending}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
