"use client";

import { FlaskConical } from "lucide-react";
import { useDeferredValue, useState } from "react";
import PageHeader from "@/components/custom/page-header";
import { ExamListItem } from "@/components/exams/ExamListItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyExams } from "@/features/exams";
import { usePermission } from "@/hooks/use-permission";
import type { ExamRequestStatus } from "@/lib/schemas/examRequest/exam-request-status.schema";
import { QueryBoundary } from "@/providers/query-boundary";

const TABS = [
	{ value: "ALL", label: "Todos" },
	{ value: "PENDING", label: "Pendentes" },
	{ value: "SCHEDULED", label: "Agendados" },
	{ value: "UPLOADED", label: "Enviados" },
	{ value: "REVIEWED", label: "Analisados" },
] as const;

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
