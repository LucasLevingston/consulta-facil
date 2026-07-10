"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ClinicResponse } from "@/features/clinics";
import { STATUS_LABEL } from "@/utils/constants/appointment-status-label";
import { ALL } from "@/utils/constants/filter-sentinels";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

type Member = NonNullable<ClinicResponse["members"]>[number];

interface Props {
	isManager: boolean;
	members: Member[];
	filterProfessionalId: string;
	filterStatus: string;
	filteredCount: number;
	onProfessionalChange: (id: string) => void;
	onStatusChange: (status: string) => void;
}

export function ClinicAppointmentsFilterBar({
	isManager,
	members,
	filterProfessionalId,
	filterStatus,
	filteredCount,
	onProfessionalChange,
	onStatusChange,
}: Props) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{isManager && (
				<Select
					value={filterProfessionalId}
					onValueChange={onProfessionalChange}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Todos os profissionais" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>Todos os profissionais</SelectItem>
						{members.map((m) => (
							<SelectItem
								key={m.professionalProfileId}
								value={m.professionalProfileId}
							>
								{m.professionalName ??
									SPECIALTY_LABELS[m.specialty] ??
									m.specialty}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
			<Select value={filterStatus} onValueChange={onStatusChange}>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="Todos os status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>Todos os status</SelectItem>
					{Object.entries(STATUS_LABEL).map(([key, label]) => (
						<SelectItem key={key} value={key}>
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<p className="ml-auto text-sm text-muted-foreground">
				{filteredCount} consulta{filteredCount !== 1 ? "s" : ""}
			</p>
		</div>
	);
}
