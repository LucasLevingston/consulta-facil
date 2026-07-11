"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ClinicMemberCard } from "./ClinicMemberCard";
import { ClinicMembersInviteDialog } from "./ClinicMembersInviteDialog";
import type { ClinicMembersTabProps } from "./ClinicMembersTab.types";
import { useRemoveClinicMember } from "./use-remove-clinic-member";

export function ClinicMembersTab({
	clinic,
	isManager,
	currentUserId,
}: ClinicMembersTabProps) {
	const [addOpen, setAddOpen] = useState(false);
	const removeMember = useRemoveClinicMember();

	const memberIds = new Set(
		clinic.members?.map((m) => m.professionalProfileId) ?? [],
	);

	function handleRemove(profileId: string, name: string) {
		removeMember.mutate(
			{ clinicId: clinic.id, professionalProfileId: profileId },
			{
				onSuccess: () => toast.success(`${name} removido da clínica.`),
				onError: () => toast.error("Erro ao remover profissional."),
			},
		);
	}

	return (
		<div className="space-y-4">
			{isManager && (
				<div className="flex justify-end">
					<Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
						<UserPlus className="h-4 w-4" />
						Convidar profissional
					</Button>
					<ClinicMembersInviteDialog
						clinicId={clinic.id}
						memberIds={memberIds}
						open={addOpen}
						onOpenChange={setAddOpen}
					/>
				</div>
			)}
			<div className="grid gap-3 sm:grid-cols-2">
				{(clinic.members ?? []).length === 0 && (
					<p className="col-span-full text-sm text-muted-foreground">
						Nenhum profissional cadastrado nesta clínica.
					</p>
				)}
				{(clinic.members ?? []).map((member) => {
					const isCurrentUser =
						currentUserId !== undefined &&
						clinic.ownerId === currentUserId &&
						member.role === "OWNER";
					return (
						<ClinicMemberCard
							key={member.professionalProfileId}
							member={member}
							isManager={isManager}
							isCurrentUser={isCurrentUser}
							isRemoving={removeMember.isPending}
							onRemove={() =>
								handleRemove(
									member.professionalProfileId,
									member.professionalName ?? "Profissional",
								)
							}
						/>
					);
				})}
			</div>
		</div>
	);
}
