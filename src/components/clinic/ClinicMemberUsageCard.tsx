"use client";

import { TrendingUp } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ClinicResponse } from "@/features/clinics";
import { FREE_CONSULTS_PER_DOCTOR } from "@/utils/constants/free-consults-per-doctor";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";
import { ClinicMemberRow } from "./ClinicMemberRow";

type Member = NonNullable<ClinicResponse["members"]>[number];
type MemberStat = {
	member: Member;
	completed: number;
	freeUsed: number;
	paidCount: number;
};

interface Props {
	memberStats: MemberStat[];
	membersCount: number;
	totalFreeQuota: number;
	totalPaid: number;
	extraProfessionals: number;
}

export function ClinicMemberUsageCard({
	memberStats,
	membersCount,
	totalFreeQuota,
	totalPaid,
	extraProfessionals,
}: Props) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
						<TrendingUp className="h-4 w-4 text-primary" />
					</div>
					<div>
						<CardTitle className="text-base">Uso por profissional</CardTitle>
						<CardDescription>
							Cada profissional tem {FREE_CONSULTS_PER_DOCTOR} consultas
							gratuitas
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{memberStats.map(({ member, completed, freeUsed, paidCount }) => (
					<ClinicMemberRow
						key={member.professionalProfileId}
						member={member}
						completed={completed}
						freeUsed={freeUsed}
						paidCount={paidCount}
					/>
				))}
				<Separator />
				<div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1 text-muted-foreground">
					<p className="font-medium text-foreground">
						Resumo do modelo de pagamento
					</p>
					<p>
						• {membersCount} profissional{membersCount !== 1 ? "is" : ""} na
						clínica — limite gratuito: {FREE_PROFESSIONALS}
					</p>
					<p>
						• {totalFreeQuota} consultas gratuitas totais (
						{FREE_CONSULTS_PER_DOCTOR} × {membersCount})
					</p>
					<p>
						• {totalPaid} consulta{totalPaid !== 1 ? "s" : ""} além da cota
						gratuita
					</p>
					{extraProfessionals > 0 && (
						<p>
							• {extraProfessionals} profissional
							{extraProfessionals !== 1 ? "is" : ""} extra — plano com +
							{extraProfessionals * 20}% no valor base
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
