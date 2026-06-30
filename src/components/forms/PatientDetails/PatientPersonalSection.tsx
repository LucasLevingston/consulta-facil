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
import type { PatientPersonalSectionProps } from "./PatientPersonalSection.types";

export function PatientPersonalSection({ form }: PatientPersonalSectionProps) {
	return (
		<section className="space-y-6">
			<div className="mb-9 space-y-1">
				<h2 className="sub-header">Informações Pessoais</h2>
			</div>

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

			<CustomFormField
				form={form}
				fieldType={FormFieldType.INPUT}
				name="cpf"
				label="CPF"
				placeholder="12345678900"
			/>

			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="address"
					label="Endereço"
					placeholder="14 rua, Nova Iorque, NY - 5101"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="occupation"
					label="Ocupação"
					placeholder="Engenheiro de Software"
				/>
			</div>

			<div className="flex flex-col gap-6 xl:flex-row">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="emergencyContactName"
					label="Nome do Contato de Emergência"
					placeholder="Nome do responsável"
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.INPUT}
					name="emergencyContactNumber"
					label="Número do Contato de Emergência"
					placeholder="(11) 91234-5678"
					type="tel"
				/>
			</div>
		</section>
	);
}
