"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { LocationPicker } from "@/components/custom/map/LocationPicker";
import { Form } from "@/components/ui/form";
import type { ClinicResponse } from "@/features/clinics";
import {
	type CreateClinicInput,
	createClinicSchema,
	useCreateClinic,
	useUpdateClinic,
} from "@/features/clinics";

export function ClinicForm({ clinic }: { clinic?: ClinicResponse }) {
	const isEdit = !!clinic;
	const [lat, setLat] = useState<number | null>(clinic?.latitude ?? null);
	const [lng, setLng] = useState<number | null>(clinic?.longitude ?? null);

	const { mutateAsync: createClinic } = useCreateClinic();
	const { mutateAsync: updateClinic } = useUpdateClinic();

	const form = useForm<CreateClinicInput>({
		resolver: zodResolver(createClinicSchema),
		defaultValues: isEdit
			? {
					name: clinic.name,
					description: clinic.description ?? "",
					phone: clinic.phone ?? "",
					address: clinic.address ?? "",
					city: clinic.city ?? "",
					state: clinic.state ?? "",
					zipCode: clinic.zipCode ?? "",
					latitude: clinic.latitude ?? undefined,
					longitude: clinic.longitude ?? undefined,
				}
			: {
					name: "",
					description: "",
					phone: "",
					address: "",
					city: "",
					state: "",
					zipCode: "",
				},
	});

	function handleLocationSelect(selectedLat: number, selectedLng: number) {
		setLat(selectedLat);
		setLng(selectedLng);
		form.setValue("latitude", selectedLat);
		form.setValue("longitude", selectedLng);
	}

	async function onSubmit(values: CreateClinicInput) {
		try {
			if (isEdit) {
				await updateClinic({ id: clinic.id, data: values });
				toast.success("Clínica atualizada com sucesso!");
			} else {
				await createClinic(values);
				toast.success("Clínica criada com sucesso!");
			}
		} catch {
			toast.error("Erro ao salvar clínica.");
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 max-w-2xl"
			>
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
