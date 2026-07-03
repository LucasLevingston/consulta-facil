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
			{professionals.map((professional) => (
				<button
					key={professional.id}
					type="button"
					className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
					onClick={() => onAdd(professional.id)}
					disabled={isPending}
				>
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={professional.imageUrl ?? undefined}
							alt={professional.name ?? ""}
						/>
						<AvatarFallback className="text-xs">
							{professional.name?.slice(0, 2).toUpperCase() ?? "PR"}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{professional.name}</p>
						<p className="text-xs text-muted-foreground">
							{SPECIALTY_LABELS[professional.specialty] ??
								professional.specialty}
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
