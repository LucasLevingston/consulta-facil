"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { type EmailInput, emailSchema } from "@/lib/schemas/auth/email.schema";

interface MagicLinkRequestFormProps {
	onSubmit: (email: string) => Promise<void>;
	isPending: boolean;
}

export default function MagicLinkRequestForm({
	onSubmit,
	isPending,
}: MagicLinkRequestFormProps) {
	const form = useForm<EmailInput>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});

	async function handleSubmit(values: EmailInput) {
		await onSubmit(values.email);
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
					fieldType={FormFieldType.EMAIL}
					name="email"
					label="E-mail"
				/>

				<CustomSubmitButton
					form={form}
					submittingText="Enviando..."
					disabled={isPending}
				>
					Enviar link de acesso
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
