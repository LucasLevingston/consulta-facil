"use client";

import { Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useApplicationStatus } from "@/hooks/api/doctors/use-application-status";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import { PROFESSIONAL_TYPE_LABELS } from "@/utils/constants/professional-types";
import { BecomeProfessionalForm } from "./BecomeProfessionalForm";

export function ApplicationStatus() {
	const { data: application, isLoading, error } = useApplicationStatus();

	if (isLoading) return null;
	if (error || !application) return <BecomeProfessionalForm />;

	if (application.status === "PENDING_REVIEW") {
		return (
			<div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-amber-50 dark:bg-amber-950/20 p-8 text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600">
					<Clock className="h-7 w-7" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Cadastro em análise
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Sua solicitação foi enviada e está aguardando aprovação. Você será
						notificado assim que uma decisão for tomada.
					</p>
				</div>
				<div className="mt-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-background px-4 py-3 text-left w-full space-y-2">
					{application.profession && (
						<div>
							<p className="text-xs font-medium text-muted-foreground mb-0.5">
								Profissão
							</p>
							<p className="text-sm font-semibold">
								{PROFESSIONAL_TYPE_LABELS[application.profession] ??
									application.profession}
							</p>
						</div>
					)}
					<div>
						<p className="text-xs font-medium text-muted-foreground mb-0.5">
							Especialidade
						</p>
						<p className="text-sm font-semibold">
							{SPECIALTY_LABELS[application.specialty] ?? application.specialty}
						</p>
					</div>
				</div>
				<Button variant="outline" asChild className="mt-2">
					<Link href="/dashboard">Voltar ao início</Link>
				</Button>
			</div>
		);
	}

	if (application.status === "REJECTED") {
		return (
			<div className="flex flex-col items-center gap-4 rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
					<XCircle className="h-7 w-7" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Cadastro não aprovado
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Sua solicitação não foi aprovada. Você pode entrar em contato com o
						suporte para mais informações.
					</p>
				</div>
				<Button variant="outline" asChild className="mt-2">
					<Link href="/dashboard">Voltar ao início</Link>
				</Button>
			</div>
		);
	}

	return <BecomeProfessionalForm />;
}
