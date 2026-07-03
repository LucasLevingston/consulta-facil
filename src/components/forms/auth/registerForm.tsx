"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { type RegisterInput, registerSchema } from "@/features/auth";
import type { RegisterFormProps } from "./registerForm.types";

export function RegisterForm({ onSubmit, isPending }: RegisterFormProps) {
	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			cpf: "",
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				noValidate
			>
				<div className="grid grid-cols-2 gap-3">
					<CustomFormField
						form={form}
						fieldType={FormFieldType.INPUT}
						name="name"
						label="Nome"
					/>
					<CustomFormField
						form={form}
						fieldType={FormFieldType.INPUT}
						name="cpf"
						label="CPF"
					/>
				</div>

				<CustomFormField
					form={form}
					fieldType={FormFieldType.EMAIL}
					name="email"
					label="E-mail"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.PASSWORD}
					name="password"
					label="Senha"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.PASSWORD}
					name="confirmPassword"
					label="Confirmar senha"
				/>

				<CustomSubmitButton
					form={form}
					submittingText="Criando conta..."
					disabled={isPending}
				>
					Criar conta
				</CustomSubmitButton>

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
		</Form>
	);
}
