"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AnamnesisReadView } from "@/components/appointments/detail/AnamnesisReadView";
import { Card, CardContent } from "@/components/ui/card";
import type { AnamnesisInput } from "@/features/appointments";
import { AnamnesisAIChatDialog } from "./AnamnesisAIChatDialog";
import { AnamnesisEditForm } from "./AnamnesisEditForm";
import type { AnamnesisSectionProps } from "./AnamnesisSection.types";
import { AnamnesisSectionHeader } from "./AnamnesisSectionHeader";
import { useAnamnesis } from "./use-anamnesis";
import { useSaveAnamnesis } from "./use-save-anamnesis";

export function AnamnesisSection({
	appointmentId,
	canEdit,
	showAiHelper,
}: AnamnesisSectionProps) {
	const { data: anamnesis, isLoading } = useAnamnesis(appointmentId);
	const { mutateAsync: save, isPending } = useSaveAnamnesis(appointmentId);

	const [editing, setEditing] = useState(false);
	const [aiOpen, setAiOpen] = useState(false);
	const [form, setForm] = useState<AnamnesisInput>({
		chiefComplaint: "",
		currentMedications: "",
		allergies: "",
		medicalHistory: "",
		familyHistory: "",
		observations: "",
	});

	function startEdit() {
		setForm({
			chiefComplaint: anamnesis?.chiefComplaint ?? "",
			currentMedications: anamnesis?.currentMedications ?? "",
			allergies: anamnesis?.allergies ?? "",
			medicalHistory: anamnesis?.medicalHistory ?? "",
			familyHistory: anamnesis?.familyHistory ?? "",
			observations: anamnesis?.observations ?? "",
		});
		setEditing(true);
	}

	async function handleSave() {
		try {
			await save(form);
			toast.success("Anamnese salva com sucesso!");
			setEditing(false);
		} catch {
			toast.error("Erro ao salvar anamnese.");
		}
	}

	if (isLoading) return null;

	return (
		<Card>
			<AnamnesisSectionHeader
				canEdit={canEdit}
				editing={editing}
				showAiHelper={!!showAiHelper}
				hasAnamnesis={!!anamnesis}
				onStartEdit={startEdit}
				onOpenAi={() => setAiOpen(true)}
			/>
			<CardContent className="-mt-2">
				{editing ? (
					<AnamnesisEditForm
						form={form}
						isPending={isPending}
						onSave={handleSave}
						onCancel={() => setEditing(false)}
						onChange={(field, value) =>
							setForm((f) => ({ ...f, [field]: value }))
						}
					/>
				) : anamnesis ? (
					<AnamnesisReadView anamnesis={anamnesis} />
				) : (
					<p className="text-sm text-muted-foreground">
						{canEdit
							? 'Nenhuma anamnese preenchida. Clique em "Preencher" para adicionar.'
							: "Anamnese não preenchida."}
					</p>
				)}
			</CardContent>
			<AnamnesisAIChatDialog
				open={aiOpen}
				onOpenChange={setAiOpen}
				onSave={async (data) => {
					await save(data);
					toast.success("Anamnese salva com sucesso!");
				}}
			/>
		</Card>
	);
}
