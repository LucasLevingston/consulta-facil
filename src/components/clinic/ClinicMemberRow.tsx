"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ClinicResponse } from "@/features/clinics";
import { FREE_CONSULTS_PER_DOCTOR } from "@/utils/constants/free-consults-per-doctor";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

type Member = NonNullable<ClinicResponse["members"]>[number];

interface Props {
	member: Member;
	completed: number;
	freeUsed: number;
	paidCount: number;
}

export function ClinicMemberRow({
	member,
	completed,
	freeUsed,
	paidCount,
}: Props) {
	return (
		<div>
			<div className="flex items-center gap-3 mb-2">
				<Avatar className="h-7 w-7 shrink-0">
					<AvatarImage src={member.imageUrl ?? undefined} />
					<AvatarFallback className="text-xs">
						{member.professionalName?.slice(0, 2).toUpperCase() ?? "DR"}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium truncate">
							{member.professionalName ?? "Profissional"}
						</p>
						<div className="flex items-center gap-1.5 shrink-0 ml-2">
							<span className="text-xs tabular-nums text-muted-foreground">
								{freeUsed}/{FREE_CONSULTS_PER_DOCTOR} grátis
							</span>
							{paidCount > 0 && (
								<Badge variant="outline" className="text-xs">
									+{paidCount} pagas
								</Badge>
							)}
						</div>
					</div>
					<p className="text-xs text-muted-foreground">
						{SPECIALTY_LABELS[member.specialty] ?? member.specialty}
					</p>
				</div>
			</div>
			<Progress
				value={(freeUsed / FREE_CONSULTS_PER_DOCTOR) * 100}
				className="h-1.5"
			/>
			{completed === 0 && (
				<p className="mt-1 text-xs text-muted-foreground">
					Nenhuma consulta realizada
				</p>
			)}
		</div>
	);
}
