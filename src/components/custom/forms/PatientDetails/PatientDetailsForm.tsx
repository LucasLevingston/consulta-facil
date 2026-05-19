"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { FileUploader } from "@/components/FileUploader";
import CustomFormField, { FormFieldType } from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useUpdateMyProfile } from "@/hooks/api/use-patients";
import { GenderOptions, IdentificationTypes } from "@/utils/constants";
import { PatientFormValidation } from "./FormValidation";

import "react-datepicker/dist/react-datepicker.css";

type PatientDefaultData = Partial<z.infer<typeof PatientFormValidation>>;

interface PatientDetailsProps {
	userId: string;
	userEmail: string;
	type: "edit" | "create";
	defaultData?: PatientDefaultData;
}

const PatientDetailsForm = ({
	userId: _userId,
	userEmail,
	type,
	defaultData,
}: PatientDetailsProps) => {
	const router = useRouter();
	const updateProfile = useUpdateMyProfile();

	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			name: defaultData?.name ?? "",
			email: defaultData?.email ?? userEmail,
			phone: defaultData?.phone ?? "",
			birthDate: defaultData?.birthDate ?? new Date(),
			gender: defaultData?.gender ?? "MALE",
			address: defaultData?.address ?? "",
			occupation: defaultData?.occupation ?? "",
			emergencyContactName: defaultData?.emergencyContactName ?? "",
			emergencyContactNumber: defaultData?.emergencyContactNumber ?? "",
			allergies: defaultData?.allergies ?? "",
			currentMedication: defaultData?.currentMedication ?? "",
			familyMedicalHistory: defaultData?.familyMedicalHistory ?? "",
			pastMedicalHistory: defaultData?.pastMedicalHistory ?? "",
			identificationDocumentType: defaultData?.identificationDocumentType ?? "Birth Certificate",
			cpf: defaultData?.cpf ?? "",
			identificationDocument: undefined,
			imageProfile: undefined,
			treatmentConsent: defaultData?.treatmentConsent ?? false,
			disclosureConsent: defaultData?.disclosureConsent ?? false,
			privacyConsent: defaultData?.privacyConsent ?? false,
		},
	});

	const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
		try {
			await updateProfile.mutateAsync({
				name: values.name,
				email: values.email,
				phone: values.phone,
				birthDate: values.birthDate.toISOString(),
				gender: values.gender,
				address: values.address,
				occupation: values.occupation,
				emergencyContactName: values.emergencyContactName,
				emergencyContactNumber: values.emergencyContactNumber,
				allergies: values.allergies,
				currentMedication: values.currentMedication,
				familyMedicalHistory: values.familyMedicalHistory,
				pastMedicalHistory: values.pastMedicalHistory,
				cpf: values.cpf,
				privacyConsent: values.privacyConsent,
				treatmentConsent: values.treatmentConsent,
				disclosureConsent: values.disclosureConsent,
			});
			toast.success("Dados salvos com sucesso!");
			if (type === "create") {
				router.push("/");
			}
		} catch (error: unknown) {
			toast.error(error instanceof Error ? error.message : "Erro ao salvar os dados");
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex-1 space-y-12"
			>
				{/* Informações Pessoais */}
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

				{/* Informações Médicas */}
				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Informações Médicas</h2>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							form={form}
							fieldType={FormFieldType.TEXTAREA}
							name="allergies"
							label="Alergias (se houver)"
							placeholder="Amendoins, Penicilina, Polen"
						/>
						<CustomFormField
							form={form}
							fieldType={FormFieldType.TEXTAREA}
							name="currentMedication"
							label="Medicações Atuais"
							placeholder="Ibuprofeno 200mg, Levotiroxina 50mcg"
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							form={form}
							fieldType={FormFieldType.TEXTAREA}
							name="familyMedicalHistory"
							label="Histórico Médico Familiar (se relevante)"
							placeholder="Mãe teve câncer cerebral, Pai tem hipertensão"
						/>
						<CustomFormField
							form={form}
							fieldType={FormFieldType.TEXTAREA}
							name="pastMedicalHistory"
							label="Histórico Médico Anterior"
							placeholder="Apendicectomia em 2015, Diagnóstico de asma na infância"
						/>
					</div>
				</section>

				{/* Identificação e Consentimento — apenas no modo criação */}
				{type === "create" && (
					<>
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
											<FileUploader
												files={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</section>

						<section className="space-y-6">
							<div className="mb-9 space-y-1">
								<h2 className="sub-header">Consentimento e Privacidade</h2>
							</div>

							<CustomFormField
								form={form}
								fieldType={FormFieldType.CHECKBOX}
								name="treatmentConsent"
								label="Eu consinto em receber tratamento para minha condição de saúde."
							/>
							<CustomFormField
								form={form}
								fieldType={FormFieldType.CHECKBOX}
								name="disclosureConsent"
								label="Eu consinto com o uso e divulgação das minhas informações de saúde para fins de tratamento."
							/>
							<CustomFormField
								form={form}
								fieldType={FormFieldType.CHECKBOX}
								name="privacyConsent"
								label="Eu reconheço que revisei e concordo com a política de privacidade."
							/>
						</section>
					</>
				)}

				<CustomSubmitButton form={form}>
					{type === "create" ? "Enviar e Continuar" : "Salvar"}
				</CustomSubmitButton>
			</form>
		</Form>
	);
};

export default PatientDetailsForm;
