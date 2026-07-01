"use client";

import type { UseFormReturn } from "react-hook-form";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { GenderOptions } from "@/utils/constants/gender-options";

interface Props {
	// biome-ignore lint/suspicious/noExplicitAny: shared with DoctorDetailsForm schema
	form: UseFormReturn<any>;
}

export function DoctorPersonalFields({ form }: Props) {
	return (
		<section className="space-y-6">
			<div className="mb-9 space-y-1">
				<h2 className="sub-header">Informações Pessoais</h2>
			</div>

			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					name="name"
					fieldType={FormFieldType.INPUT}
				/>
				<CustomFormField
					form={form}
					name="email"
					fieldType={FormFieldType.EMAIL}
				/>
			</div>

			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					name="phone"
					fieldType={FormFieldType.INPUT}
				/>
				<CustomFormField
					form={form}
					name="gender"
					fieldType={FormFieldType.SELECT}
					label="Gênero"
					selectOptions={GenderOptions}
				/>
			</div>

			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					name="birthDate"
					fieldType={FormFieldType.DATE_PICKER}
				/>
				<CustomFormField
					form={form}
					name="cpf"
					fieldType={FormFieldType.INPUT}
				/>
			</div>

			<CustomFormField
				form={form}
				name="address"
				fieldType={FormFieldType.INPUT}
			/>
		</section>
	);
}
