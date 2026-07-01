"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AuthMobileLogo from "@/components/auth/AuthMobileLogo";
import { RegisterForm } from "@/components/forms/auth/registerForm";
import type { RegisterInput } from "@/features/auth";
import { useLogin, useRegister } from "@/features/auth";

export default function RegisterPage() {
	const router = useRouter();
	const register = useRegister();
	const login = useLogin();

	async function handleSubmit(data: RegisterInput) {
		try {
			await register.mutateAsync(data);
			await login.mutateAsync({ email: data.email, password: data.password });
			toast.success("Conta criada com sucesso!");
			router.push("/auth/complete-profile");
		} catch {
			toast.error("Erro ao criar conta. Tente novamente.");
		}
	}

	return (
		<div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
			<AuthMobileLogo />
			<div className="w-full max-w-sm space-y-8">
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight text-foreground">
						Criar conta
					</h2>
					<p className="text-sm text-muted-foreground">
						Comece gratuitamente, sem cartão de crédito
					</p>
				</div>

				<RegisterForm
					onSubmit={handleSubmit}
					isPending={register.isPending || login.isPending}
				/>
			</div>
		</div>
	);
}
