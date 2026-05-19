"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogin } from "@/hooks/api/auth/use-login";
import { useRegister } from "@/hooks/api/auth/use-register";
import type { LoginInput, RegisterInput } from "@/lib/schemas/auth.schema";

import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/registerForm";

export const UserForm = () => {
	const router = useRouter();
	const login = useLogin();
	const register = useRegister();

	async function handleLogin(values: LoginInput) {
		try {
			await login.mutateAsync(values);
			router.push("/dashboard");
		} catch {
			toast.error("E-mail ou senha incorretos.");
		}
	}

	async function handleRegister(data: RegisterInput) {
		try {
			await register.mutateAsync(data);
			await login.mutateAsync({ email: data.email, password: data.password });
			router.push("/auth/completar-cadastro");
		} catch {
			toast.error("Erro ao registrar usuário.");
		}
	}

	return (
		<Tabs defaultValue="register" className="flex w-full max-w-md flex-col gap-4">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="register" className="font-bold">
					Registrar
				</TabsTrigger>
				<TabsTrigger value="login" className="font-bold">
					Entrar
				</TabsTrigger>
			</TabsList>

			<TabsContent value="register">
				<RegisterForm onSubmit={handleRegister} isPending={register.isPending} />
			</TabsContent>

			<TabsContent value="login">
				<LoginForm onSubmit={handleLogin} isPending={login.isPending} />
			</TabsContent>
		</Tabs>
	);
};
