"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProntuarioReadView } from "@/components/appointments/detail/ProntuarioReadView";
import { CustomButton } from "@/components/custom/custom-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProntuarioInput } from "@/features/appointments";
import { useProntuario, useSaveProntuario } from "@/features/appointments";
import { ProntuarioEditForm } from "./ProntuarioEditForm";
import type { ProntuarioSectionProps } from "./ProntuarioSection.types";

export function ProntuarioSection({
	appointmentId,
	canEdit,
}: ProntuarioSectionProps) {
	const { data: prontuario, isLoading } = useProntuario(appointmentId);
	const { mutateAsync: save, isPending } = useSaveProntuario(appointmentId);

	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState<ProntuarioInput>({
		clinicalNotes: "",
		diagnosis: "",
		diagnosisCid: "",
		prescription: "",
		examRequests: "",
		treatmentPlan: "",
		followUpInstructions: "",
	});

	function startEdit() {
		setForm({
			clinicalNotes: prontuario?.clinicalNotes ?? "",
			diagnosis: prontuario?.diagnosis ?? "",
			diagnosisCid: prontuario?.diagnosisCid ?? "",
			prescription: prontuario?.prescription ?? "",
			examRequests: prontuario?.examRequests ?? "",
			treatmentPlan: prontuario?.treatmentPlan ?? "",
			followUpInstructions: prontuario?.followUpInstructions ?? "",
		});
		setEditing(true);
	}

	async function handleSave() {
		try {
			await save(form);
			toast.success("Prontuário salvo com sucesso!");
			setEditing(false);
		} catch {
			toast.error("Erro ao salvar prontuário.");
		}
	}

	if (isLoading) return null;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
						<FileText className="h-4 w-4" />
						Prontuário
					</CardTitle>
					{canEdit && !editing && (
						<CustomButton variant="outline" size="sm" onClick={startEdit}>
							{prontuario ? "Editar" : "Preencher"}
						</CustomButton>
					)}
				</div>
			</CardHeader>
			<CardContent className="-mt-2">
				{editing ? (
					<ProntuarioEditForm
						form={form}
						isPending={isPending}
						onSave={handleSave}
						onCancel={() => setEditing(false)}
						onChange={(field, value) =>
							setForm((f) => ({ ...f, [field]: value }))
						}
					/>
				) : prontuario ? (
					<ProntuarioReadView prontuario={prontuario} />
				) : (
					<p className="text-sm text-muted-foreground">
						{canEdit
							? 'Prontuário não preenchido. Clique em "Preencher" para adicionar.'
							: "Prontuário não disponível."}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
