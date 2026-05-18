"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/registerForm";

export const UserForm = () => {
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
				<RegisterForm />
			</TabsContent>

			<TabsContent value="login">
				<LoginForm />
			</TabsContent>
		</Tabs>
	);
};
