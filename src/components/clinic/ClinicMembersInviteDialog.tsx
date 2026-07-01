"use client";

import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSendClinicInvite } from "@/features/notifications";
import { useProfessionals } from "@/features/professionals";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

interface Props {
	clinicId: string;
	memberIds: Set<string>;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export function ClinicMembersInviteDialog({
	clinicId,
	memberIds,
	open,
	onOpenChange,
}: Props) {
	const [search, setSearch] = useState("");
	const { data: allProfessionals } = useProfessionals(0, 200);
	const sendInvite = useSendClinicInvite();
	const sq = search.trim().toLowerCase();
	const filtered = (allProfessionals?.content ?? []).filter(
		(d) =>
			!memberIds.has(d.id) &&
			d.status === "ACTIVE" &&
			(!sq ||
				d.name?.toLowerCase().includes(sq) ||
				d.specialty.toLowerCase().includes(sq)),
	);

	function handleAdd(professionalProfileId: string) {
		sendInvite.mutate(
			{ clinicId, professionalProfileId },
			{
				onSuccess: () => {
					toast.success("Convite enviado ao profissional.");
					onOpenChange(false);
					setSearch("");
				},
				onError: () => toast.error("Erro ao enviar convite."),
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Convidar profissional</DialogTitle>
					<DialogDescription>
						O profissional receberá uma notificação para aceitar o convite.
					</DialogDescription>
				</DialogHeader>
				<div className="relative mt-2">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Buscar por nome ou especialidade..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-8"
					/>
				</div>
				<div className="mt-2 max-h-72 space-y-1 overflow-y-auto">
					{filtered.length === 0 && (
						<p className="py-6 text-center text-sm text-muted-foreground">
							Nenhum profissional disponível encontrado.
						</p>
					)}
					{filtered.map((doctor) => (
						<button
							key={doctor.id}
							type="button"
							className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
							onClick={() => handleAdd(doctor.id)}
							disabled={sendInvite.isPending}
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
							{sendInvite.isPending && (
								<Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
							)}
						</button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
