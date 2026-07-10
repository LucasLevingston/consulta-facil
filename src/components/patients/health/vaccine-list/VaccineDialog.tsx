"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type PatientVaccineInput,
	patientVaccineSchema,
	useAddVaccine,
} from "@/features/patients";
import { VaccineDialogForm } from "./VaccineDialogForm";
import type { VaccineDialogProps } from "./VaccineList.types";

export function VaccineDialog({ open, onClose }: VaccineDialogProps) {
	const add = useAddVaccine();
	const form = useForm<PatientVaccineInput>({
		resolver: zodResolver(patientVaccineSchema),
		defaultValues: {
			vaccineName: "",
			doseNumber: "",
			administeredAt: "",
			notes: "",
		},
	});

	function onSubmit(data: PatientVaccineInput) {
		add.mutate(data, {
			onSuccess: () => {
				toast.success("Vacina adicionada!");
				form.reset();
				onClose();
			},
			onError: () => toast.error("Erro ao adicionar."),
		});
	}

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nova vacina</DialogTitle>
				</DialogHeader>
				<VaccineDialogForm
					form={form}
					isPending={add.isPending}
					onSubmit={onSubmit}
					onClose={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
