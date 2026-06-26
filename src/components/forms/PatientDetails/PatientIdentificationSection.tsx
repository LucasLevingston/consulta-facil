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
import { IdentificationTypes } from "@/utils/constants/identification-types";
import type { PatientFormValidation } from "./FormValidation";

type FormValues = z.infer<typeof PatientFormValidation>;

export function PatientIdentificationSection({
	form,
}: {
	form: UseFormReturn<FormValues>;
}) {
	return (
		<section className="space-y-6">
			<div className="mb-9 space-y-1">
				<h2 className="sub-header">Identificação e Verificação</h2>
			</div>

			<CustomFormField
				form={form}
				fieldType={FormFieldType.SELECT}
				name="identificationDocumentType"
				label="Tipo de Identificação"
				placeholder="Selecione o tipo de identificação"
			>
				{IdentificationTypes.map((idType) => (
					<option key={idType} value={idType}>
						{idType}
					</option>
				))}
			</CustomFormField>

			<FormField
				control={form.control}
				name="identificationDocument"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-semibold text-primary">
							Cópia Escaneada do Documento de Identificação
						</FormLabel>
						<FormControl>
							<FileUploader files={field.value} onChange={field.onChange} />
						</FormControl>
					</FormItem>
				)}
			/>
		</section>
	);
}
