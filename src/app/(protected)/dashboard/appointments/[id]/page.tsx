"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	ArrowLeft,
	CalendarDays,
	ClipboardList,
	CreditCard,
	ExternalLink,
	FileText,
	MessageSquare,
	QrCode,
	RefreshCw,
	Star,
	Stethoscope,
	User,
	Video,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";

import { ExamsSection } from "@/components/custom/forms/Appointments/ExamsSection";
import { RateAppointmentForm } from "@/components/custom/forms/Appointments/RateAppointmentForm";
import { RescheduleAppointmentForm } from "@/components/custom/forms/Appointments/RescheduleAppointmentForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
	useAnamnesis,
	useProntuario,
	useSaveAnamnesis,
	useSaveProntuario,
} from "@/hooks/api/use-anamnesis";
import {
	useAppointment,
	useCheckInToken,
	useCreatePayment,
	useGenerateMeetLink,
} from "@/hooks/api/use-appointments";
import type {
	AnamnesisInput,
	AnamnesisResponse,
	ProntuarioInput,
	ProntuarioResponse,
} from "@/lib/schemas/anamnesis.schema";
import type {
	AppointmentResponse,
	AppointmentStatus,
} from "@/lib/schemas/appointment.schema";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

const STATUS_CONFIG: Record<
	AppointmentStatus,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	CONFIRMED: { label: "Confirmada", variant: "default" },
	CHECKED_IN: { label: "Check-in feito", variant: "default" },
	IN_PROGRESS: { label: "Em atendimento", variant: "default" },
	COMPLETED: { label: "Concluída", variant: "outline" },
	CANCELED: { label: "Cancelada", variant: "destructive" },
};

function StarDisplay({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((n) => (
				<Star
					key={n}
					className={`h-4 w-4 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
				/>
			))}
		</div>
	);
}

// ──────────────────────────────────────────────────────────────
// Anamnesis section
// ──────────────────────────────────────────────────────────────

function AnamnesisSection({
	appointmentId,
	canEdit,
}: {
	appointmentId: string;
	canEdit: boolean;
}) {
	const { data: anamnesis, isLoading } = useAnamnesis(appointmentId);
	const { mutateAsync: save, isPending } = useSaveAnamnesis(appointmentId);

	const [editing, setEditing] = useState(false);
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
						<Button variant="outline" size="sm" onClick={startEdit}>
							{anamnesis ? "Editar" : "Preencher"}
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="-mt-2">
				{editing ? (
					<div className="space-y-4">
						<AnamnesisField
							label="Queixa principal"
							value={form.chiefComplaint ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, chiefComplaint: v }))}
						/>
						<AnamnesisField
							label="Medicamentos em uso"
							value={form.currentMedications ?? ""}
							onChange={(v) =>
								setForm((f) => ({ ...f, currentMedications: v }))
							}
						/>
						<AnamnesisField
							label="Alergias"
							value={form.allergies ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, allergies: v }))}
						/>
						<AnamnesisField
							label="Histórico médico"
							value={form.medicalHistory ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, medicalHistory: v }))}
						/>
						<AnamnesisField
							label="Histórico familiar"
							value={form.familyHistory ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, familyHistory: v }))}
						/>
						<AnamnesisField
							label="Observações"
							value={form.observations ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, observations: v }))}
						/>
						<div className="flex gap-2 pt-1">
							<Button size="sm" onClick={handleSave} disabled={isPending}>
								{isPending ? "Salvando..." : "Salvar"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setEditing(false)}
							>
								Cancelar
							</Button>
						</div>
					</div>
				) : anamnesis ? (
					<AnamnesisReadView anamnesis={anamnesis} />
				) : (
					<p className="text-sm text-muted-foreground">
						{canEdit
							? "Nenhuma anamnese preenchida. Clique em &ldquo;Preencher&rdquo; para adicionar."
							: "Anamnese não preenchida."}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

function AnamnesisField({
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

// ──────────────────────────────────────────────────────────────
// Prontuario section
// ──────────────────────────────────────────────────────────────

function ProntuarioSection({
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
						<Button variant="outline" size="sm" onClick={startEdit}>
							{prontuario ? "Editar" : "Preencher"}
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="-mt-2">
				{editing ? (
					<div className="space-y-4">
						<AnamnesisField
							label="Anotações clínicas / Exame físico"
							value={form.clinicalNotes ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, clinicalNotes: v }))}
						/>
						<AnamnesisField
							label="Diagnóstico"
							value={form.diagnosis ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, diagnosis: v }))}
						/>
						<AnamnesisField
							label="CID-10"
							value={form.diagnosisCid ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, diagnosisCid: v }))}
						/>
						<AnamnesisField
							label="Prescrição"
							value={form.prescription ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, prescription: v }))}
						/>
						<AnamnesisField
							label="Solicitações de exame"
							value={form.examRequests ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, examRequests: v }))}
						/>
						<AnamnesisField
							label="Plano terapêutico"
							value={form.treatmentPlan ?? ""}
							onChange={(v) => setForm((f) => ({ ...f, treatmentPlan: v }))}
						/>
						<AnamnesisField
							label="Orientações e retorno"
							value={form.followUpInstructions ?? ""}
							onChange={(v) =>
								setForm((f) => ({ ...f, followUpInstructions: v }))
							}
						/>
						<div className="flex gap-2 pt-1">
							<Button size="sm" onClick={handleSave} disabled={isPending}>
								{isPending ? "Salvando..." : "Salvar"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setEditing(false)}
							>
								Cancelar
							</Button>
						</div>
					</div>
				) : prontuario ? (
					<ProntuarioReadView prontuario={prontuario} />
				) : (
					<p className="text-sm text-muted-foreground">
						{canEdit
							? "Prontuário não preenchido. Clique em &ldquo;Preencher&rdquo; para adicionar."
							: "Prontuário não disponível."}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

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

// ──────────────────────────────────────────────────────────────
// Main detail view
function QrCodeDialog({ appointmentId }: { appointmentId: string }) {
	const { data, isLoading } = useCheckInToken(appointmentId);

	if (isLoading) return <p className="text-sm text-muted-foreground text-center py-4">Gerando código...</p>;
	if (!data) return <p className="text-sm text-destructive text-center py-4">Erro ao gerar código.</p>;

	const QRCodeSVG = require("qrcode.react").QRCodeSVG;
	return (
		<div className="flex flex-col items-center gap-4 py-2">
			<QRCodeSVG value={data.token} size={220} level="M" />
			<p className="text-xs text-muted-foreground text-center">
				Válido por 1 hora. Apresente à recepção ao chegar.
			</p>
		</div>
	);
}

// ──────────────────────────────────────────────────────────────

function AppointmentDetail({
	appointment,
}: {
	appointment: AppointmentResponse;
}) {
	const { user } = useUserStore();
	const [rateOpen, setRateOpen] = useState(false);
	const [rescheduleOpen, setRescheduleOpen] = useState(false);
	const [qrOpen, setQrOpen] = useState(false);

	const { mutateAsync: generateMeetLink, isPending: generatingLink } =
		useGenerateMeetLink();
	const { mutateAsync: createPayment, isPending: creatingPayment } =
		useCreatePayment();

	const role = user?.role ?? "PATIENT";
	const isPatient = role === "PATIENT";
	const isProfessional = role === "PROFESSIONAL" || role === "ADMIN";
	const isOnline = appointment.modality === "ONLINE";
	const canRate =
		isPatient &&
		appointment.status === "COMPLETED" &&
		appointment.rating == null;
	const canReschedule =
		appointment.status === "PENDING" || appointment.status === "CONFIRMED";

	const statusConfig = STATUS_CONFIG[appointment.status];
	const scheduledDate = new Date(appointment.scheduledAt);

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
					<Link href="/dashboard/appointments">
						<ArrowLeft className="h-4 w-4" />
						Voltar
					</Link>
				</Button>
			</div>

			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-xl font-bold text-foreground">
						Detalhes da consulta
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						{format(scheduledDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
							locale: ptBR,
						})}
					</p>
				</div>
				<Badge variant={statusConfig.variant} className="shrink-0">
					{statusConfig.label}
				</Badge>
			</div>

			{/* Doctor info */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
						<Stethoscope className="h-4 w-4" />
						Profissional
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center gap-4 -mt-2">
					<Avatar className="h-12 w-12 shrink-0">
						<AvatarImage alt={appointment.professionalName ?? ""} />
						<AvatarFallback>
							{(appointment.professionalName ?? "?")[0]}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-semibold">{appointment.professionalName}</p>
						{appointment.specialty && (
							<p className="text-sm text-muted-foreground">
								{appointment.specialty}
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Schedule info */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
							<CalendarDays className="h-4 w-4" />
							Agendamento
						</CardTitle>
						<div className="flex flex-wrap gap-2">
							{isOnline && appointment.meetLink && (
								<Button
									size="sm"
									className="gap-2"
									asChild
								>
									<a
										href={appointment.meetLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Video className="h-3.5 w-3.5" />
										Entrar na consulta
										<ExternalLink className="h-3 w-3" />
									</a>
								</Button>
							)}
							{isOnline && !appointment.meetLink && isProfessional && (
								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									disabled={generatingLink}
									onClick={() => generateMeetLink(appointment.id)}
								>
									<Video className="h-3.5 w-3.5" />
									{generatingLink ? "Gerando..." : "Gerar link Meet"}
								</Button>
							)}
							{isPatient && appointment.status === "CONFIRMED" && !isOnline && (
								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() => setQrOpen(true)}
								>
									<QrCode className="h-3.5 w-3.5" />
									QR Check-in
								</Button>
							)}
							{canReschedule && (
								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() => setRescheduleOpen(true)}
								>
									<RefreshCw className="h-3.5 w-3.5" />
									Remarcar
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-3 -mt-2">
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p className="text-xs text-muted-foreground mb-0.5">Data</p>
							<p className="font-medium">
								{format(scheduledDate, "dd/MM/yyyy", { locale: ptBR })}
							</p>
						</div>
						<div>
							<p className="text-xs text-muted-foreground mb-0.5">Horário</p>
							<p className="font-medium">
								{format(scheduledDate, "HH:mm", { locale: ptBR })}
							</p>
						</div>
						<div>
							<p className="text-xs text-muted-foreground mb-0.5">Modalidade</p>
							<p className="font-medium flex items-center gap-1">
								{isOnline ? (
									<>
										<Video className="h-3.5 w-3.5 text-blue-500" />
										Teleconsulta
									</>
								) : (
									"Presencial"
								)}
							</p>
						</div>
					</div>

					{appointment.previousScheduledAt && (
						<>
							<Separator />
							<div>
								<p className="text-xs text-muted-foreground mb-0.5">
									Data original
								</p>
								<p className="text-sm text-muted-foreground line-through">
									{format(
										new Date(appointment.previousScheduledAt),
										"dd/MM/yyyy 'às' HH:mm",
										{ locale: ptBR },
									)}
								</p>
							</div>
						</>
					)}

					{appointment.reason && (
						<>
							<Separator />
							<div>
								<p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
									<User className="h-3 w-3" />
									Motivo
								</p>
								<p className="text-sm">{appointment.reason}</p>
							</div>
						</>
					)}

					{isProfessional && appointment.patientName && (
						<>
							<Separator />
							<div>
								<p className="text-xs text-muted-foreground mb-0.5">Paciente</p>
								<p className="text-sm font-medium">{appointment.patientName}</p>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			<Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="mb-2 space-y-1">
						<DialogTitle>Remarcar consulta</DialogTitle>
						<DialogDescription>
							Selecione a nova data e horário para a consulta.
						</DialogDescription>
					</DialogHeader>
					<RescheduleAppointmentForm
						appointment={appointment}
						setOpen={setRescheduleOpen}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={qrOpen} onOpenChange={setQrOpen}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader className="mb-2 space-y-1">
						<DialogTitle>QR Code para check-in</DialogTitle>
						<DialogDescription>
							Apresente este código ao chegar na clínica.
						</DialogDescription>
					</DialogHeader>
					<QrCodeDialog appointmentId={appointment.id} />
				</DialogContent>
			</Dialog>

			{/* Exams */}
			<ExamsSection
				appointmentId={appointment.id}
				isPatient={isPatient}
				isProfessional={isProfessional}
			/>

			{/* Anamnesis — editable by patient (and professional) */}
			<AnamnesisSection
				appointmentId={appointment.id}
				canEdit={isPatient || isProfessional}
			/>

			{/* Prontuario — editable by professional only, visible to patient read-only */}
			<ProntuarioSection
				appointmentId={appointment.id}
				canEdit={isProfessional}
			/>

			{/* Cancellation reason */}
			{appointment.status === "CANCELED" && appointment.cancellationReason && (
				<Card className="border-destructive/30 bg-destructive/5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm text-destructive/80 font-medium">
							<XCircle className="h-4 w-4" />
							Motivo do cancelamento
						</CardTitle>
					</CardHeader>
					<CardContent className="-mt-2">
						<p className="text-sm">{appointment.cancellationReason}</p>
					</CardContent>
				</Card>
			)}

			{/* Payment */}
			{isPatient &&
				appointment.status !== "CANCELED" &&
				appointment.paymentStatus !== "PAID" && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
								<CreditCard className="h-4 w-4" />
								Pagamento antecipado
							</CardTitle>
						</CardHeader>
						<CardContent className="-mt-2 flex flex-col gap-3">
							<p className="text-sm text-muted-foreground">
								{appointment.paymentStatus === "PENDING_PAYMENT"
									? "Pagamento pendente. Conclua no link abaixo."
									: "Pague antecipadamente e garanta seu atendimento."}
							</p>
							<Button
								size="sm"
								className="gap-2 w-fit"
								disabled={creatingPayment}
								onClick={async () => {
									const result = await createPayment({
										appointmentId: appointment.id,
									});
									window.open(result.checkoutUrl, "_blank");
								}}
							>
								<CreditCard className="h-4 w-4" />
								{creatingPayment ? "Processando..." : "Pagar consulta"}
							</Button>
						</CardContent>
					</Card>
				)}

			{/* Payment confirmed badge */}
			{appointment.paymentStatus === "PAID" && (
				<Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
					<CardContent className="py-3 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
						<CreditCard className="h-4 w-4" />
						Pagamento confirmado
						{appointment.paymentAmount && (
							<span className="ml-auto font-medium">
								R$ {appointment.paymentAmount.toFixed(2)}
							</span>
						)}
					</CardContent>
				</Card>
			)}

			{/* Rating */}
			{appointment.status === "COMPLETED" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
							<MessageSquare className="h-4 w-4" />
							Avaliação
						</CardTitle>
					</CardHeader>
					<CardContent className="-mt-2">
						{appointment.rating != null ? (
							<div className="space-y-2">
								<StarDisplay rating={appointment.rating} />
								{appointment.ratingComment && (
									<p className="text-sm text-muted-foreground italic">
										&ldquo;{appointment.ratingComment}&rdquo;
									</p>
								)}
							</div>
						) : canRate ? (
							<div className="flex flex-col items-start gap-3">
								<p className="text-sm text-muted-foreground">
									Você ainda não avaliou esta consulta.
								</p>
								<Button
									size="sm"
									className="gap-2"
									onClick={() => setRateOpen(true)}
								>
									<Star className="h-4 w-4" />
									Avaliar consulta
								</Button>
								<Dialog open={rateOpen} onOpenChange={setRateOpen}>
									<DialogContent className="sm:max-w-md">
										<DialogHeader className="mb-2 space-y-1">
											<DialogTitle>Avaliar consulta</DialogTitle>
											<DialogDescription>
												Sua avaliação ajuda outros pacientes a escolher o
												profissional certo.
											</DialogDescription>
										</DialogHeader>
										<RateAppointmentForm
											appointment={appointment}
											setOpen={setRateOpen}
										/>
									</DialogContent>
								</Dialog>
							</div>
						) : (
							<p className="text-sm text-muted-foreground">Sem avaliação.</p>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default function AppointmentDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data, isLoading, error } = useAppointment(id);

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{data && <AppointmentDetail appointment={data} />}
		</QueryBoundary>
	);
}
