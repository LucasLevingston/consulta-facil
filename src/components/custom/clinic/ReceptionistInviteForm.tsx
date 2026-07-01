"use client";

import type { FormEventHandler } from "react";
import type { UseFormReturn } from "react-hook-form";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { InviteReceptionistInput } from "@/features/clinics";

interface Props {
	form: UseFormReturn<InviteReceptionistInput>;
	onSubmit: FormEventHandler<HTMLFormElement>;
	onCancel: () => void;
}

export function ReceptionistInviteForm({ form, onSubmit, onCancel }: Props) {
	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="flex gap-2 items-end">
				<div className="flex-1">
					<CustomFormField
						form={form}
						name="email"
						fieldType={FormFieldType.EMAIL}
						label="E-mail do usuário"
						placeholder="usuario@email.com"
					/>
				</div>
				<CustomSubmitButton form={form} submittingText="Adicionando...">
					Adicionar
				</CustomSubmitButton>
				<Button type="button" variant="ghost" size="sm" onClick={onCancel}>
					Cancelar
				</Button>
			</form>
		</Form>
	);
}
