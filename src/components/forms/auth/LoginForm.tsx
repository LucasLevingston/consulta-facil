"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { type LoginInput, loginSchema } from "@/lib/schemas/auth/login.schema";
import type { LoginFormProps } from "./LoginForm.types";

export default function LoginForm({ onSubmit, isPending }: LoginFormProps) {
	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				noValidate
			>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.EMAIL}
					name="email"
					label="E-mail"
				/>

				<div className="space-y-1">
					<CustomFormField
						form={form}
						fieldType={FormFieldType.PASSWORD}
						name="password"
						label="Senha"
					/>
					<div className="flex justify-end">
						<Link
							href="/auth/forgot-password"
							className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
						>
							Esqueci minha senha
						</Link>
					</div>
				</div>

				<CustomSubmitButton
					form={form}
					submittingText="Entrando..."
					disabled={isPending}
				>
					Entrar
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
