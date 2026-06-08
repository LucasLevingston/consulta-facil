"use client";

import { ClipboardList, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AnamnesisAIChat } from "@/components/anamnesis/AnamnesisAIChat";
import { CustomButton } from "@/components/custom/custom-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAnamnesis } from "@/hooks/api/anamnesis/use-anamnesis";
import { useSaveAnamnesis } from "@/hooks/api/anamnesis/use-save-anamnesis";
import type { AnamnesisInput } from "@/lib/schemas/anamnesis/anamnesis.schema";
import type { AnamnesisResponse } from "@/lib/schemas/anamnesis/anamnesis-response.schema";

export function MedicalRecordField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="space-y-1.5">
			<Label className="text-xs font-semibold text-primary">{label}</Label>
			<Textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				rows={2}
				className="resize-none rounded-xl border-border bg-bg-input text-sm"
			/>
		</div>
	);
}

function AnamnesisReadView({ anamnesis }: { anamnesis: AnamnesisResponse }) {
	const fields: [string, string | undefined][] = [
		["Queixa principal", anamnesis.chiefComplaint],
		["Medicamentos em uso", anamnesis.currentMedications],
		["Alergias", anamnesis.allergies],
		["Histórico médico", anamnesis.medicalHistory],
		["Histórico familiar", anamnesis.familyHistory],
		["Observações", anamnesis.observations],
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

export function AnamnesisSection({
	appointmentId,
	canEdit,
	showAiHelper,
}: {
	appointmentId: string;
	canEdit: boolean;
	showAiHelper?: boolean;
}) {
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
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
						<ClipboardList className="h-4 w-4" />
						Anamnese
					</CardTitle>
					{canEdit && !editing && (
						<div className="flex gap-2">
							{showAiHelper && (
								<CustomButton
									variant="outline"
									size="sm"
									className="gap-1.5"
									onClick={() => setAiOpen(true)}
								>
									<Sparkles className="h-3.5 w-3.5 text-primary" />
									Preencher com IA
								</CustomButton>
							)}
							<CustomButton variant="outline" onClick={startEdit}>
								{anamnesis ? "Editar" : "Preencher"}
							</CustomButton>
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="-mt-2">
				{editing ? (
					<div className="space-y-4">
						<MedicalRecordField
							label="Queixa principal"
							value={form.chiefComplaint ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, chiefComplaint: v }))}
						/>
						<MedicalRecordField
							label="Medicamentos em uso"
							value={form.currentMedications ?? ""}
							onChange={(v) =>
								setForm((f) => ({ ...f, currentMedications: v }))
							}
						/>
						<MedicalRecordField
							label="Alergias"
							value={form.allergies ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, allergies: v }))}
						/>
						<MedicalRecordField
							label="Histórico médico"
							value={form.medicalHistory ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, medicalHistory: v }))}
						/>
						<MedicalRecordField
							label="Histórico familiar"
							value={form.familyHistory ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, familyHistory: v }))}
						/>
						<MedicalRecordField
							label="Observações"
							value={form.observations ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, observations: v }))}
						/>
						<div className="flex gap-2 pt-1">
							<CustomButton size="sm" onClick={handleSave} disabled={isPending}>
								{isPending ? "Salvando..." : "Salvar"}
							</CustomButton>
							<CustomButton
								variant="secondary"
								size="sm"
								onClick={() => setEditing(false)}
							>
								Cancelar
							</CustomButton>
						</div>
					</div>
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

			<Dialog open={aiOpen} onOpenChange={setAiOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader className="mb-2 space-y-1">
						<DialogTitle className="flex items-center gap-2">
							<Sparkles className="h-4 w-4 text-primary" />
							Preencher anamnese com IA
						</DialogTitle>
						<DialogDescription>
							Responda às perguntas do assistente. Ao terminar, clique em
							&ldquo;Salvar na anamnese&rdquo;.
						</DialogDescription>
					</DialogHeader>
					<AnamnesisAIChat
						onSave={async (data) => {
							await save(data);
							toast.success("Anamnese salva com sucesso!");
						}}
						onClose={() => setAiOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
