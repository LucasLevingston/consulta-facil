"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/api/use-doctors";
import { toast } from "@/hooks/use-toast";
import type { DoctorResponse } from "@/lib/schemas/doctor.schema";
import { GenderOptions, specialties } from "@/utils/constants";
import { DoctorFormValidation } from "./FormValidation";

interface DoctorDetailsProps {
	userId: string;
	userEmail: string;
	type: "edit" | "create";
	defaultData?: DoctorResponse;
}

function DoctorDetailsForm({
	userId,
	userEmail,
	type,
	defaultData,
}: DoctorDetailsProps) {
	const router = useRouter();

	const createDoctor = useCreateDoctor();
	const updateDoctor = useUpdateDoctor();

	const form = useForm<z.infer<typeof DoctorFormValidation>>({
		resolver: zodResolver(DoctorFormValidation),
		defaultValues: {
			name: defaultData?.name ?? "",
			email: defaultData?.email ?? userEmail,
			phone: defaultData?.phone ?? "",
			gender: "MALE",
			birthDate: new Date(),
			cpf: "",
			address: "",
			specialty: defaultData?.specialty ?? "",
			licenseNumber: defaultData?.licenseNumber ?? "",
			identificationDocumentType: "",
			identificationDocument: undefined,
			privacyConsent: false,
		},
	});

	const onSubmit = async (values: z.infer<typeof DoctorFormValidation>) => {
		const payload = {
			name: values.name,
			email: values.email,
			specialty: values.specialty,
			licenseNumber: values.licenseNumber,
			phone: values.phone,
		};

		try {
			if (type === "create") {
				await createDoctor.mutateAsync(payload);
				toast({ title: "Dados salvos com sucesso!" });
				router.push("/");
			} else {
				await updateDoctor.mutateAsync({ doctorId: userId, data: payload });
				toast({ title: "Dados salvos com sucesso!" });
			}
		} catch (error: unknown) {
			toast({
				title: error instanceof Error ? error.message : "Erro ao salvar os dados",
				variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex-1 space-y-12"
			>
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
						>
							{GenderOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</CustomFormField>
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

					<h2 className="sub-header">Informações Profissionais</h2>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							form={form}
							name="specialty"
							fieldType={FormFieldType.SELECT}
						>
							{specialties.map((speciality) => (
								<SelectItem key={speciality} value={speciality}>
									{speciality}
								</SelectItem>
							))}
						</CustomFormField>

						<CustomFormField
							form={form}
							name="licenseNumber"
							fieldType={FormFieldType.INPUT}
						/>
					</div>
				</section>

				<CustomSubmitButton form={form}>
					{type === "create" ? "Enviar e Continuar" : "Salvar"}
				</CustomSubmitButton>
			</form>
		</Form>
	);
}

export default DoctorDetailsForm;
