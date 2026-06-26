"use client";

import { FlaskConical } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useExamRequestsByAppointment } from "@/hooks/api/exam-requests/use-exam-requests-by-appointment";
import { ExamCard } from "./ExamCard";
import { RequestExamForm } from "./RequestExamForm";

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
