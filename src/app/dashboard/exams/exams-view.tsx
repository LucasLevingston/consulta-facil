"use client";

import { FlaskConical } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { usePermission } from "@/components/auth/hooks";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { ExamListItem } from "@/components/exams/ExamListItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ExamRequestStatus } from "@/features/exams";
import { useMyExams } from "@/features/exams";

const TABS = [
	{ value: "ALL", label: "Todos" },
	{ value: "PENDING", label: "Pendentes" },
	{ value: "SCHEDULED", label: "Agendados" },
	{ value: "UPLOADED", label: "Enviados" },
	{ value: "REVIEWED", label: "Analisados" },
] as const;

function ExamsList({
	status,
	isPatient,
	isProfessional,
}: {
	status: string;
	isPatient: boolean;
	isProfessional: boolean;
}) {
	const { data: exams } = useMyExams(
		status === "ALL" ? undefined : (status as ExamRequestStatus),
	);

	if (exams.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
				<FlaskConical className="h-10 w-10 mb-3 opacity-30" />
				<p className="text-sm">Nenhum exame encontrado.</p>
			</div>
		);
	}

	return (
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
	);
}

export function ExamsView() {
	const { role } = usePermission();
	const [statusFilter, setStatusFilter] = useState<string>("ALL");
	const deferred = useDeferredValue(statusFilter);

	const isPatient = role === "PATIENT";
	const isProfessional = role === "PROFESSIONAL";

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

			<SuspenseBoundary>
				<ExamsList
					status={deferred}
					isPatient={isPatient}
					isProfessional={isProfessional}
				/>
			</SuspenseBoundary>
		</div>
	);
}
