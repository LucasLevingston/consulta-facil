"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	CheckCircle,
	FileText,
	FlaskConical,
	Paperclip,
	Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateExamRequest } from "@/hooks/api/exam-requests/use-create-exam-request";
import { useExamRequestsByAppointment } from "@/hooks/api/exam-requests/use-exam-requests-by-appointment";
import { useReviewExam } from "@/hooks/api/exam-requests/use-review-exam";
import { useUploadExamResult } from "@/hooks/api/exam-requests/use-upload-exam-result";
import {
	type CreateExamRequestInput,
	createExamRequestSchema,
} from "@/lib/schemas/examRequest/create-exam-request.schema";
import type { ExamRequestResponse } from "@/lib/schemas/examRequest/exam-request-response.schema";
import {
	EXAM_TYPE_LABELS,
	EXAM_TYPE_OPTIONS,
} from "@/utils/constants/exam-types";

const STATUS_CONFIG: Record<
	ExamRequestResponse["status"],
	{ label: string; variant: "default" | "secondary" | "outline" }
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	SCHEDULED: { label: "Agendado", variant: "secondary" },
	UPLOADED: { label: "Enviado", variant: "default" },
	REVIEWED: { label: "Analisado", variant: "outline" },
};

function ExamCard({
	exam,
	isPatient,
	isProfessional,
}: {
	exam: ExamRequestResponse;
	isPatient: boolean;
	isProfessional: boolean;
}) {
	const { mutateAsync: upload } = useUploadExamResult();
	const { mutateAsync: review } = useReviewExam();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [reviewNotes, setReviewNotes] = useState("");
	const [reviewing, setReviewing] = useState(false);
	const [showReviewForm, setShowReviewForm] = useState(false);
	const statusCfg = STATUS_CONFIG[exam.status];

	async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			await upload({ examId: exam.id, file });
			toast.success("Arquivo enviado com sucesso!");
		} catch {
			toast.error("Erro ao enviar arquivo.");
		} finally {
			setUploading(false);
		}
	}

	async function handleReview() {
		if (!reviewNotes.trim()) return;
		setReviewing(true);
		try {
			await review({
				examId: exam.id,
				data: { professionalNotes: reviewNotes },
			});
			toast.success("Observações salvas!");
			setShowReviewForm(false);
		} catch {
			toast.error("Erro ao salvar observações.");
		} finally {
			setReviewing(false);
		}
	}

	return (
		<div className="space-y-2">
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-2">
					<FlaskConical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<p className="text-sm font-medium">
							{EXAM_TYPE_LABELS[exam.examName] ?? exam.examName}
						</p>
						{exam.instructions && (
							<p className="text-xs text-muted-foreground mt-0.5">
								{exam.instructions}
							</p>
						)}
					</div>
				</div>
				<Badge variant={statusCfg.variant} className="shrink-0 text-xs">
					{statusCfg.label}
				</Badge>
			</div>

			{exam.fileUrl && (
				<a
					href={exam.fileUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-xs text-primary hover:underline"
				>
					<Paperclip className="h-3 w-3" />
					{exam.fileName ?? "Ver arquivo"}
				</a>
			)}

			{exam.professionalNotes && (
				<div className="rounded-lg bg-muted/50 p-3">
					<p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
						<CheckCircle className="h-3 w-3" />
						Observações do profissional
					</p>
					<p className="text-sm leading-relaxed">{exam.professionalNotes}</p>
				</div>
			)}

			{isPatient && exam.status === "PENDING" && (
				<>
					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,.jpg,.jpeg,.png"
						className="hidden"
						onChange={handleUpload}
					/>
					<Button
						size="sm"
						variant="outline"
						className="gap-2"
						disabled={uploading}
						onClick={() => fileInputRef.current?.click()}
					>
						<Upload className="h-3.5 w-3.5" />
						{uploading ? "Enviando..." : "Enviar resultado"}
					</Button>
				</>
			)}

			{isProfessional && exam.status === "UPLOADED" && !showReviewForm && (
				<Button
					size="sm"
					variant="outline"
					className="gap-2"
					onClick={() => setShowReviewForm(true)}
				>
					<FileText className="h-3.5 w-3.5" />
					Adicionar observações
				</Button>
			)}

			{showReviewForm && (
				<div className="space-y-2">
					<Textarea
						value={reviewNotes}
						onChange={(e) => setReviewNotes(e.target.value)}
						placeholder="Descreva suas observações sobre o resultado..."
						rows={3}
						className="resize-none text-sm"
					/>
					<div className="flex gap-2">
						<Button size="sm" onClick={handleReview} disabled={reviewing}>
							{reviewing ? "Salvando..." : "Salvar"}
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setShowReviewForm(false)}
						>
							Cancelar
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

function RequestExamForm({ appointmentId }: { appointmentId: string }) {
	const { mutateAsync: create } = useCreateExamRequest(appointmentId);
	const [open, setOpen] = useState(false);

	const form = useForm<CreateExamRequestInput>({
		resolver: zodResolver(createExamRequestSchema),
		defaultValues: { instructions: "" },
	});

	async function onSubmit(values: CreateExamRequestInput) {
		try {
			await create(values);
			toast.success("Solicitação de exame criada!");
			form.reset();
			setOpen(false);
		} catch {
			toast.error("Erro ao solicitar exame.");
		}
	}

	if (!open) {
		return (
			<Button
				size="sm"
				variant="outline"
				className="gap-2"
				onClick={() => setOpen(true)}
			>
				<FlaskConical className="h-3.5 w-3.5" />
				Solicitar exame
			</Button>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
				<CustomFormField
					form={form}
					fieldType={FormFieldType.SELECT}
					name="examName"
					label="Nome do exame"
					placeholder="Selecione o exame"
					selectOptions={EXAM_TYPE_OPTIONS}
				/>
				<CustomFormField
					form={form}
					fieldType={FormFieldType.TEXTAREA}
					name="instructions"
					label="Instruções (opcional)"
					placeholder="Ex: Em jejum por 8 horas"
				/>
				<div className="flex gap-2">
					<CustomSubmitButton form={form} submittingText="Solicitando...">
						Solicitar
					</CustomSubmitButton>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setOpen(false)}
					>
						Cancelar
					</Button>
				</div>
			</form>
		</Form>
	);
}

interface ExamsSectionProps {
	appointmentId: string;
	isPatient: boolean;
	isProfessional: boolean;
}

export function ExamsSection({
	appointmentId,
	isPatient,
	isProfessional,
}: ExamsSectionProps) {
	const { data: exams = [], isLoading } =
		useExamRequestsByAppointment(appointmentId);

	if (isLoading) return null;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
						<FlaskConical className="h-4 w-4" />
						Exames
					</CardTitle>
					{isProfessional && <RequestExamForm appointmentId={appointmentId} />}
				</div>
			</CardHeader>
			<CardContent className="-mt-2">
				{exams.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						{isProfessional
							? 'Nenhum exame solicitado. Clique em "Solicitar exame" para adicionar.'
							: "Nenhum exame solicitado."}
					</p>
				) : (
					<div className="space-y-4">
						{exams.map((exam, i) => (
							<div key={exam.id}>
								{i > 0 && <Separator className="mb-4" />}
								<ExamCard
									exam={exam}
									isPatient={isPatient}
									isProfessional={isProfessional}
								/>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
