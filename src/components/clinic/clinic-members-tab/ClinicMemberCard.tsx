"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ClinicResponse } from "@/features/clinics";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

type ClinicMember = NonNullable<ClinicResponse["members"]>[number];

interface Props {
	member: ClinicMember;
	isManager: boolean;
	isCurrentUser: boolean;
	isRemoving: boolean;
	onRemove: () => void;
}

export function ClinicMemberCard({
	member,
	isManager,
	isCurrentUser,
	isRemoving,
	onRemove,
}: Props) {
	const isOwner = member.role === "OWNER";
	return (
		<Card className="transition-shadow hover:shadow-sm">
			<CardContent className="flex items-center gap-3 p-4">
				<Avatar className="h-10 w-10 shrink-0">
					<AvatarImage
						src={member.imageUrl ?? undefined}
						alt={member.professionalName ?? ""}
					/>
					<AvatarFallback>
						{member.professionalName?.slice(0, 2).toUpperCase() ?? "DR"}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-1.5">
						<p className="truncate text-sm font-semibold">
							{member.professionalName ?? "Profissional"}
						</p>
						{isOwner && (
							<Badge variant="secondary" className="shrink-0 text-xs">
								Proprietário
							</Badge>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						{SPECIALTY_LABELS[member.specialty] ?? member.specialty}
					</p>
				</div>
				{isManager && !isCurrentUser && !isOwner && (
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
						onClick={onRemove}
						disabled={isRemoving}
					>
						{isRemoving ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Trash2 className="h-4 w-4" />
						)}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
