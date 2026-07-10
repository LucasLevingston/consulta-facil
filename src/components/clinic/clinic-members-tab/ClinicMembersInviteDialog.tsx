"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useProfessionals } from "@/components/professionals/hooks";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSendClinicInvite } from "@/features/notifications";
import { ClinicMemberInviteList } from "./ClinicMemberInviteList";

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
					<ClinicMemberInviteList
						professionals={filtered}
						isPending={sendInvite.isPending}
						onAdd={handleAdd}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
