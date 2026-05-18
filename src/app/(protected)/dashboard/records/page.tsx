"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Search, User } from "lucide-react";
import { useMemo, useState } from "react";

import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctorAppointments, usePatientAppointments } from "@/hooks/api/use-appointments";
import { useMedicalRecords, useMyProfile } from "@/hooks/api/use-patients";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

export default function RecordsPage() {
	const { user } = useUserStore();
	const isDoctor = user?.role === "DOCTOR" || user?.role === "ADMIN";

	return (
		<div className="space-y-6">
			<PageHeader
				title="Prontuários"
				description={
					isDoctor
						? "Consulte os prontuários dos seus pacientes."
						: "Seu histórico médico e informações de saúde."
				}
				icon={<FileText className="h-6 w-6" />}
			/>
			{isDoctor ? <DoctorRecordsView doctorId={user?.id ?? ""} /> : <PatientRecordsView />}
		</div>
	);
}

function DoctorRecordsView({ doctorId }: { doctorId: string }) {
	const [search, setSearch] = useState("");
	const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

	const { data, isLoading, error } = useDoctorAppointments(doctorId, 0, 200);

	const patients = useMemo(() => {
		const seen = new Set<string>();
		return (data?.content ?? [])
			.filter((a) => {
				if (seen.has(a.patientId)) return false;
				seen.add(a.patientId);
				return true;
			})
			.map((a) => ({ id: a.patientId, name: a.patientName ?? "Paciente" }))
			.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
	}, [data, search]);

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
				{/* Sidebar — lista de pacientes */}
				<div className="space-y-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Buscar paciente..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 rounded-xl"
						/>
					</div>

					<div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
						{patients.length === 0 ? (
							<p className="py-8 text-center text-sm text-muted-foreground">
								Nenhum paciente encontrado.
							</p>
						) : (
							patients.map((p) => (
								<button
									key={p.id}
									type="button"
									onClick={() => setSelectedPatientId(p.id)}
									className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
										selectedPatientId === p.id
											? "bg-primary/10 text-primary"
											: "hover:bg-muted"
									}`}
								>
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
										<User className="h-4 w-4 text-muted-foreground" />
									</div>
									<span className="truncate text-sm font-medium">{p.name}</span>
								</button>
							))
						)}
					</div>
				</div>

				{/* Painel — prontuário do paciente selecionado */}
				<div>
					{selectedPatientId ? (
						<PatientRecordDetail patientId={selectedPatientId} />
					) : (
						<div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border">
							<p className="text-sm text-muted-foreground">
								Selecione um paciente para ver o prontuário.
							</p>
						</div>
					)}
				</div>
			</div>
		</QueryBoundary>
	);
}

function PatientRecordDetail({ patientId }: { patientId: string }) {
	const { data: records, isLoading, error } = useMedicalRecords(patientId);

	if (isLoading) return <RecordSkeleton />;
	if (error) return <p className="text-sm text-destructive">Erro ao carregar prontuário.</p>;
	if (!records) return <p className="text-sm text-muted-foreground">Sem prontuário cadastrado.</p>;

	return (
		<div className="space-y-4">
			<RecordSection title="Alergias" value={records.allergies} />
			<RecordSection title="Medicações em uso" value={records.currentMedication} />
			<RecordSection title="Histórico familiar" value={records.familyMedicalHistory} />
			<RecordSection title="Histórico pessoal" value={records.pastMedicalHistory} />

			<div className="flex flex-wrap gap-2 pt-2">
				<ConsentBadge label="Tratamento" consented={records.treatmentConsent} />
				<ConsentBadge label="Divulgação" consented={records.disclosureConsent} />
				<ConsentBadge label="Privacidade" consented={records.privacyConsent} />
			</div>

			{records.updatedAt && (
				<p className="text-xs text-muted-foreground">
					Atualizado em{" "}
					{format(new Date(records.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
				</p>
			)}
		</div>
	);
}

function PatientRecordsView() {
	const { data: profile, isLoading: profileLoading } = useMyProfile();
	const userId = profile?.userId ?? "";
	const { data: records, isLoading: recordsLoading, error } = useMedicalRecords(userId);

	const isLoading = profileLoading || recordsLoading;

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{!records ? (
				<p className="text-sm text-muted-foreground">Sem prontuário cadastrado.</p>
			) : (
				<div className="rounded-2xl border border-border bg-card p-6 space-y-4">
					<RecordSection title="Alergias" value={records.allergies} />
					<RecordSection title="Medicações em uso" value={records.currentMedication} />
					<RecordSection title="Histórico familiar" value={records.familyMedicalHistory} />
					<RecordSection title="Histórico pessoal" value={records.pastMedicalHistory} />

					<div className="flex flex-wrap gap-2 pt-2">
						<ConsentBadge label="Tratamento" consented={records.treatmentConsent} />
						<ConsentBadge label="Divulgação" consented={records.disclosureConsent} />
						<ConsentBadge label="Privacidade" consented={records.privacyConsent} />
					</div>
				</div>
			)}
		</QueryBoundary>
	);
}

function RecordSection({ title, value }: { title: string; value?: string | null }) {
	return (
		<Card className="border-border">
			<CardContent className="p-4">
				<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
					{title}
				</p>
				<p className="text-sm text-foreground">{value || "Não informado"}</p>
			</CardContent>
		</Card>
	);
}

function ConsentBadge({ label, consented }: { label: string; consented?: boolean | null }) {
	return (
		<Badge variant={consented ? "default" : "secondary"}>
			{label}: {consented ? "Consentido" : "Não consentido"}
		</Badge>
	);
}

function RecordSkeleton() {
	return (
		<div className="space-y-4">
			{Array.from({ length: 4 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
				<Card key={i} className="border-border">
					<CardContent className="p-4 space-y-2">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-4 w-full" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
