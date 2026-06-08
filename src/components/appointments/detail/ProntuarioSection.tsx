"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CustomButton } from "@/components/custom/custom-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProntuario } from "@/hooks/api/anamnesis/use-prontuario";
import { useSaveProntuario } from "@/hooks/api/anamnesis/use-save-prontuario";
import type { ProntuarioInput } from "@/lib/schemas/anamnesis/prontuario.schema";
import type { ProntuarioResponse } from "@/lib/schemas/anamnesis/prontuario-response.schema";
import { MedicalRecordField } from "./AnamnesisSection";

function ProntuarioReadView({
	prontuario,
}: {
	prontuario: ProntuarioResponse;
}) {
	const fields: [string, string | undefined][] = [
		["Anotações clínicas / Exame físico", prontuario.clinicalNotes],
		["Diagnóstico", prontuario.diagnosis],
		["CID-10", prontuario.diagnosisCid],
		["Prescrição", prontuario.prescription],
		["Solicitações de exame", prontuario.examRequests],
		["Plano terapêutico", prontuario.treatmentPlan],
		["Orientações e retorno", prontuario.followUpInstructions],
	];

	const filled = fields.filter(([, v]) => v);
	if (filled.length === 0)
		return (
			<p className="text-sm text-muted-foreground">
				Sem informações preenchidas.
			</p>
		);

	return (
		<div className="space-y-3">
			{filled.map(([label, value], i) => (
				<div key={label}>
					{i > 0 && <Separator className="mb-3" />}
					<p className="text-xs text-muted-foreground mb-0.5">{label}</p>
					<p className="text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
				</div>
			))}
		</div>
	);
}

export function ProntuarioSection({
	appointmentId,
	canEdit,
}: {
	appointmentId: string;
	canEdit: boolean;
}) {
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
					<div className="space-y-4">
						<MedicalRecordField
							label="Anotações clínicas / Exame físico"
							value={form.clinicalNotes ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, clinicalNotes: v }))}
						/>
						<MedicalRecordField
							label="Diagnóstico"
							value={form.diagnosis ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, diagnosis: v }))}
						/>
						<MedicalRecordField
							label="CID-10"
							value={form.diagnosisCid ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, diagnosisCid: v }))}
						/>
						<MedicalRecordField
							label="Prescrição"
							value={form.prescription ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, prescription: v }))}
						/>
						<MedicalRecordField
							label="Solicitações de exame"
							value={form.examRequests ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, examRequests: v }))}
						/>
						<MedicalRecordField
							label="Plano terapêutico"
							value={form.treatmentPlan ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, treatmentPlan: v }))}
						/>
						<MedicalRecordField
							label="Orientações e retorno"
							value={form.followUpInstructions ?? ""}
							onChange={(v) =>
								setForm((f) => ({ ...f, followUpInstructions: v }))
							}
						/>
						<div className="flex gap-2 pt-1">
							<CustomButton size="sm" onClick={handleSave} disabled={isPending}>
								{isPending ? "Salvando..." : "Salvar"}
							</CustomButton>
							<CustomButton
								variant="ghost"
								size="sm"
								onClick={() => setEditing(false)}
							>
								Cancelar
							</CustomButton>
						</div>
					</div>
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
