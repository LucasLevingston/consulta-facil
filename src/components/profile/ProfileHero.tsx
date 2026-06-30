"use client";

import { BadgeCheck, Pencil, Settings, Shield } from "lucide-react";
import Link from "next/link";

import { AvatarUpload } from "@/components/custom/avatar-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserResponse } from "@/features/auth";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

interface ProfessionalData {
	specialty?: string | null;
	licenseNumber?: string | null;
}

export function ProfileHero({
	user,
	isProfessional,
	professionalData,
}: {
	user: UserResponse;
	isProfessional: boolean;
	professionalData?: ProfessionalData | null;
}) {
	return (
		<Card className="overflow-hidden">
			<div className="h-28 bg-gradient-to-br from-primary/25 via-primary/10 to-secondary/20 relative">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
			</div>
			<CardContent className="relative pt-0 pb-6 px-6">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
					<AvatarUpload size="lg" />
					<div className="flex gap-2 sm:mb-1">
						<Button
							variant="outline"
							size="sm"
							asChild
							className="gap-1.5 rounded-xl"
						>
							<Link href="/settings">
								<Pencil className="h-3.5 w-3.5" />
								Editar perfil
							</Link>
						</Button>
						<Button
							variant="outline"
							size="sm"
							asChild
							className="gap-1.5 rounded-xl"
						>
							<Link href="/settings">
								<Settings className="h-3.5 w-3.5" />
								Configurações
							</Link>
						</Button>
					</div>
				</div>

				<div className="mt-4 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="text-2xl font-bold">{user.name}</h1>
						<Badge
							variant="secondary"
							className="gap-1 rounded-full px-2.5 py-0.5 text-xs"
						>
							<BadgeCheck className="h-3 w-3" />
							{isProfessional ? "Profissional" : "Paciente"}
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">{user.email}</p>
					{isProfessional && professionalData && (
						<div className="flex flex-wrap gap-2 mt-2">
							<Badge variant="outline" className="gap-1.5">
								<Shield className="h-3 w-3" />
								{professionalData.specialty
									? (SPECIALTY_LABELS[professionalData.specialty] ??
										professionalData.specialty)
									: ""}
							</Badge>
							<Badge variant="outline" className="gap-1.5 font-mono text-xs">
								CRM {professionalData.licenseNumber}
							</Badge>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
