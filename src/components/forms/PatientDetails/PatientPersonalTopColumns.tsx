import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { FileUploader } from "@/components/FileUploader";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { GenderOptions } from "@/utils/constants/gender-options";
import type { PatientFormValidation } from "./FormValidation";

interface Props {
	form: UseFormReturn<z.infer<typeof PatientFormValidation>>;
}

export function PatientPersonalTopColumns({ form }: Props) {
	return (
		<div className="flex w-full items-start gap-6">
			<div className="flex min-w-[50%] flex-col gap-6">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="name"
					label="Nome completo"
					placeholder="João da Silva"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.EMAIL}
					name="email"
					label="Endereço de E-mail"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="phone"
					label="Número de Telefone"
					placeholder="(11) 91234-5678"
					type="tel"
				/>
			</div>
			<div className="flex min-w-[50%] flex-col gap-6">
				<FormField
					control={form.control}
					name="imageProfile"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-primary">
								Foto de perfil
							</FormLabel>
							<FormControl>
								<FileUploader
									files={field.value}
									onChange={field.onChange}
									imageProfile
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<CustomFormField
					form={form}
					name="gender"
					fieldType={FormFieldType.SELECT}
					label="Gênero"
				>
					{GenderOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</CustomFormField>
			</div>
		</div>
	);
}
