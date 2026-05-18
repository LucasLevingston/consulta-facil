"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { type LoginInput, loginSchema } from "@/lib/schemas/auth.schema";

import CustomFormField, {
	FormFieldType,
} from "../../forms-components/custom-form-field";
import { CustomSubmitButton } from "../../forms-components/custom-submit-button";

interface LoginFormProps {
	onSubmit: (values: LoginInput) => Promise<void>;
	isPending: boolean;
}

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex-1 space-y-6"
			>
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

				<CustomSubmitButton form={form} submittingText="Entrando..." disabled={isPending}>
					Entrar
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
