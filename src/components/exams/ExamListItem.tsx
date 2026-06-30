"use client";

import {
	CalendarClock,
	CheckCircle,
	FileText,
	FlaskConical,
	MapPin,
	Paperclip,
	Phone,
	Upload,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ExamRequestResponse } from "@/features/exams";
import {
	useCancelExamScheduling,
	useReviewExam,
	useUploadExamResult,
} from "@/features/exams";
import { EXAM_TYPE_LABELS } from "@/utils/constants/exam-types";
import type { ExamListItemProps } from "./ExamListItem.types";

const STATUS_CONFIG: Record<
	ExamRequestResponse["status"],
	{ label: string; variant: "default" | "secondary" | "outline" }
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	SCHEDULED: { label: "Agendado", variant: "default" },
	UPLOADED: { label: "Enviado", variant: "default" },
	REVIEWED: { label: "Analisado", variant: "outline" },
};

export function ExamListItem({
	exam,
	isPatient,
	isProfessional,
}: ExamListItemProps) {
	const { mutateAsync: upload } = useUploadExamResult();
	const { mutateAsync: review } = useReviewExam();
	const { mutateAsync: cancelScheduling, isPending: cancelling } =
		useCancelExamScheduling();
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

	async function handleCancelScheduling() {
		if (!exam.schedulingId) return;
		try {
			await cancelScheduling(exam.schedulingId);
			toast.success("Agendamento cancelado.");
		} catch {
			toast.error("Erro ao cancelar agendamento.");
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
		<Card>
			<CardContent className="p-5 space-y-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-2">
						<FlaskConical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<p className="font-medium">
								{EXAM_TYPE_LABELS[exam.examName] ?? exam.examName}
							</p>
							<p className="text-xs text-muted-foreground">
								{isPatient ? exam.professionalName : exam.patientName}
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

				{isPatient && exam.status === "SCHEDULED" && exam.labName && (
					<div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
						<p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
							<CalendarClock className="h-3 w-3" />
							Agendamento
						</p>
						{exam.scheduledAt && (
							<p className="text-sm">
								{new Date(exam.scheduledAt).toLocaleString("pt-BR", {
									dateStyle: "long",
									timeStyle: "short",
								})}
							</p>
						)}
						<p className="text-sm font-medium">{exam.labName}</p>
						{exam.labAddress && (
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<MapPin className="h-3 w-3 shrink-0" />
								{exam.labAddress}
							</p>
						)}
						{exam.labPhone && (
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<Phone className="h-3 w-3 shrink-0" />
								{exam.labPhone}
							</p>
						)}
					</div>
				)}

				{isPatient &&
					(exam.status === "PENDING" || exam.status === "SCHEDULED") && (
						<div className="flex flex-wrap gap-2">
							{exam.status === "PENDING" && (
								<Link href={`/laboratories?examId=${exam.id}`}>
									<Button size="sm" variant="default" className="gap-2">
										<MapPin className="h-3.5 w-3.5" />
										Escolher laboratório
									</Button>
								</Link>
							)}
							{exam.status === "SCHEDULED" && exam.schedulingId && (
								<Button
									size="sm"
									variant="destructive"
									className="gap-2"
									disabled={cancelling}
									onClick={handleCancelScheduling}
								>
									<X className="h-3.5 w-3.5" />
									{cancelling ? "Cancelando..." : "Cancelar agendamento"}
								</Button>
							)}
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
						</div>
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
			</CardContent>
		</Card>
	);
}
