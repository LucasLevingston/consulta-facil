"use client";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { LocationPicker } from "@/components/custom/map/LocationPicker";
import { Form } from "@/components/ui/form";
import { useClinicForm } from "@/features/clinics/hooks/use-clinic-form";
import type { ClinicFormProps } from "./ClinicForm.types";

export function ClinicForm({ clinic }: ClinicFormProps) {
	const { form, isEdit, lat, lng, handleLocationSelect, onSubmit } =
		useClinicForm(clinic);

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Informações básicas
					</h3>
					<CustomFormField
						form={form}
						name="name"
						fieldType={FormFieldType.INPUT}
					/>
					<CustomFormField
						form={form}
						name="description"
						fieldType={FormFieldType.TEXTAREA}
					/>
					<CustomFormField
						form={form}
						name="phone"
						fieldType={FormFieldType.INPUT}
					/>
				</div>

				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Endereço
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<CustomFormField
							form={form}
							name="address"
							fieldType={FormFieldType.INPUT}
						/>
						<CustomFormField
							form={form}
							name="zipCode"
							fieldType={FormFieldType.INPUT}
							label="CEP"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<CustomFormField
							form={form}
							name="city"
							fieldType={FormFieldType.INPUT}
							label="Cidade"
						/>
						<CustomFormField
							form={form}
							name="state"
							fieldType={FormFieldType.INPUT}
							label="Estado"
						/>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Localização no mapa
					</h3>
					<LocationPicker
						lat={lat}
						lng={lng}
						onLocationSelect={handleLocationSelect}
					/>
				</div>

				<CustomSubmitButton form={form} isDirty={form.formState.isDirty}>
					{isEdit ? "Salvar alterações" : "Criar clínica"}
				</CustomSubmitButton>
			</form>
		</Form>
	);
}
