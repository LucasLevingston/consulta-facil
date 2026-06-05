"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RegisterForm } from "@/components/forms/auth/registerForm";
import { useLogin } from "@/hooks/api/auth/use-login";
import { useRegister } from "@/hooks/api/auth/use-register";
import type { RegisterInput } from "@/lib/schemas/auth/register.schema";

export default function RegisterPage() {
	const router = useRouter();
	const register = useRegister();
	const login = useLogin();

	async function handleSubmit(data: RegisterInput) {
		try {
			await register.mutateAsync(data);
			await login.mutateAsync({ email: data.email, password: data.password });
			toast.success("Conta criada com sucesso!");
			router.push("/auth/completar-cadastro");
		} catch {
			toast.error("Erro ao criar conta. Tente novamente.");
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
