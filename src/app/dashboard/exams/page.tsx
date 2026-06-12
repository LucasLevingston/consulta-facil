"use client";

import {
	CheckCircle,
	FileText,
	FlaskConical,
	MapPin,
	Paperclip,
	Upload,
} from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useRef, useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMyExams } from "@/hooks/api/exam-requests/use-my-exams";
import { useReviewExam } from "@/hooks/api/exam-requests/use-review-exam";
import { useUploadExamResult } from "@/hooks/api/exam-requests/use-upload-exam-result";
import { usePermission } from "@/hooks/use-permission";
import type { ExamRequestResponse } from "@/lib/schemas/examRequest/exam-request-response.schema";
import type { ExamRequestStatus } from "@/lib/schemas/examRequest/exam-request-status.schema";
import { QueryBoundary } from "@/providers/query-boundary";
import { EXAM_TYPE_LABELS } from "@/utils/constants/exam-types";

const STATUS_CONFIG: Record<
	ExamRequestResponse["status"],
	{ label: string; variant: "default" | "secondary" | "outline" }
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	SCHEDULED: { label: "Agendado", variant: "default" },
	UPLOADED: { label: "Enviado", variant: "default" },
	REVIEWED: { label: "Analisado", variant: "outline" },
};

const TABS = [
	{ value: "ALL", label: "Todos" },
	{ value: "PENDING", label: "Pendentes" },
	{ value: "SCHEDULED", label: "Agendados" },
	{ value: "UPLOADED", label: "Enviados" },
	{ value: "REVIEWED", label: "Analisados" },
] as const;

function ExamListItem({
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

				{isPatient && exam.status === "PENDING" && (
					<div className="flex flex-wrap gap-2">
						<Link href={`/laboratories?examId=${exam.id}`}>
							<Button size="sm" variant="default" className="gap-2">
								<MapPin className="h-3.5 w-3.5" />
								Escolher laboratório
							</Button>
						</Link>
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

export default function ExamsPage() {
	const { role } = usePermission();
	const [statusFilter, setStatusFilter] = useState<string>("ALL");
	const deferred = useDeferredValue(statusFilter);

	const isPatient = role === "PATIENT";
	const isProfessional = role === "PROFESSIONAL";

	const {
		data: exams = [],
		isLoading,
		error,
	} = useMyExams(
		deferred === "ALL" ? undefined : (deferred as ExamRequestStatus),
	);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Meus Exames"
				description={
					isPatient
						? "Exames solicitados pelos seus profissionais."
						: "Exames solicitados por você para pacientes."
				}
				icon={<FlaskConical className="h-6 w-6" />}
			/>

			<Tabs value={statusFilter} onValueChange={setStatusFilter}>
				<TabsList>
					{TABS.map((t) => (
						<TabsTrigger key={t.value} value={t.value}>
							{t.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			<QueryBoundary isLoading={isLoading} error={error}>
				{exams.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
						<FlaskConical className="h-10 w-10 mb-3 opacity-30" />
						<p className="text-sm">Nenhum exame encontrado.</p>
					</div>
				) : (
					<div className="grid gap-4">
						{exams.map((exam) => (
							<ExamListItem
								key={exam.id}
								exam={exam}
								isPatient={isPatient}
								isProfessional={isProfessional}
							/>
						))}
					</div>
				)}
			</QueryBoundary>
		</div>
	);
}
