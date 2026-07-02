import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfessionalResponse } from "@/features/professionals";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

interface Props {
	professionals: ProfessionalResponse[];
	isPending: boolean;
	onAdd: (id: string) => void;
}

export function ClinicMemberInviteList({
	professionals,
	isPending,
	onAdd,
}: Props) {
	if (professionals.length === 0) {
		return (
			<p className="py-6 text-center text-sm text-muted-foreground">
				Nenhum profissional disponível encontrado.
			</p>
		);
	}
	return (
		<>
			{professionals.map((doctor) => (
				<button
					key={doctor.id}
					type="button"
					className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
					onClick={() => onAdd(doctor.id)}
					disabled={isPending}
				>
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={doctor.imageUrl ?? undefined}
							alt={doctor.name ?? ""}
						/>
						<AvatarFallback className="text-xs">
							{doctor.name?.slice(0, 2).toUpperCase() ?? "DR"}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{doctor.name}</p>
						<p className="text-xs text-muted-foreground">
							{SPECIALTY_LABELS[doctor.specialty] ?? doctor.specialty}
						</p>
					</div>
					{isPending && (
						<Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
					)}
				</button>
			))}
		</>
	);
}
