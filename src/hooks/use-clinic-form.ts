import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ClinicResponse } from "@/features/clinics";
import {
	type CreateClinicInput,
	createClinicSchema,
	useCreateClinic,
	useUpdateClinic,
} from "@/features/clinics";

export function useClinicForm(clinic?: ClinicResponse) {
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

	const onSubmit = form.handleSubmit(async (values: CreateClinicInput) => {
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
	});

	return { form, isEdit, lat, lng, handleLocationSelect, onSubmit };
}
