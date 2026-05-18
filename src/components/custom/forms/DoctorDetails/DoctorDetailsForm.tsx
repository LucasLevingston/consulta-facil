"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";

import { useCreateDoctor, useUpdateDoctor } from "@/hooks/api/use-doctors";
import { toast } from "@/hooks/use-toast";
import type { DoctorResponse } from "@/lib/schemas/doctor.schema";
import { GenderOptions, specialties } from "@/utils/constants";

import CustomFormField, {
	FormFieldType,
} from "../../forms-components/custom-form-field";
import { CustomSubmitButton } from "../../forms-components/custom-submit-button";
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
			gender: "male",
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
				setTimeout(() => router.push("/"), 1000);
			} else {
				await updateDoctor.mutateAsync({ doctorId: userId, data: payload });
			}

			toast({ title: "Dados salvos com sucesso!" });
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

						<FormField
							control={form.control}
							name="gender"
							render={({ field }) => (
								<FormItem className="w-full">
									<Label className="mb-3 block text-sm font-semibold text-primary">
										Gênero
									</Label>

									<FormControl>
										<RadioGroup
											className="flex h-11 flex-wrap gap-6"
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											{GenderOptions.map((option) => (
												<div
													key={option.value}
													className="flex items-center gap-2"
												>
													<RadioGroupItem
														value={option.value}
														id={option.value}
													/>

													<Label
														htmlFor={option.value}
														className="cursor-pointer"
													>
														{option.label}
													</Label>
												</div>
											))}
										</RadioGroup>
									</FormControl>
								</FormItem>
							)}
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
