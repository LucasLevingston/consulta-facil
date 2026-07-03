"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { type ResetPasswordInput, resetPasswordSchema } from "@/features/auth";
import type { ResetPasswordFormProps } from "./ResetPasswordForm.types";

export default function ResetPasswordForm({
	onSubmit,
	isPending,
}: ResetPasswordFormProps) {
	const form = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { newPassword: "", confirmPassword: "" },
	});

	async function handleSubmit(values: ResetPasswordInput) {
		await onSubmit(values.newPassword);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4"
				noValidate
			>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.PASSWORD}
					name="newPassword"
					label="Nova senha"
					placeholder="Mínimo 8 caracteres"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.PASSWORD}
					name="confirmPassword"
					label="Confirmar senha"
					placeholder="Repita a nova senha"
				/>
				<CustomSubmitButton
					form={form}
					submittingText="Redefinindo..."
					disabled={isPending}
				>
					Redefinir senha
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
