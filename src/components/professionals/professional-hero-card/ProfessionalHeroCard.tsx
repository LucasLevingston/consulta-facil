"use client";

import { Calendar, MessageCircle, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfessionalResponse } from "@/features/professionals";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import { ProfessionalHeroRating } from "./ProfessionalHeroRating";

interface ProfessionalMessaging {
	available: boolean;
	pending: boolean;
	onSend: () => void;
}

interface Props {
	professional: ProfessionalResponse;
	initials: string;
	messaging: ProfessionalMessaging;
	onSchedule: () => void;
}

export function ProfessionalHeroCard({
	professional,
	initials,
	messaging,
	onSchedule,
}: Props) {
	return (
		<Card className="overflow-hidden">
			<div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20" />
			<CardContent className="relative pt-0 pb-6 px-6">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
					<Avatar className="size-20 rounded-2xl border-4 border-card shadow-md">
						<AvatarImage
							src={professional.imageUrl ?? undefined}
							alt={professional.name ?? "Profissional"}
						/>
						<AvatarFallback className="rounded-2xl bg-primary/15 text-primary font-bold text-2xl">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="flex gap-2 flex-wrap">
						{messaging.available && (
							<Button
								variant="outline"
								onClick={messaging.onSend}
								disabled={messaging.pending}
								className="gap-2 shrink-0"
							>
								<MessageCircle className="h-4 w-4" />
								Enviar mensagem
							</Button>
						)}
						<Button onClick={onSchedule} className="gap-2 shrink-0">
							<Calendar className="h-4 w-4" />
							Agendar consulta
						</Button>
					</div>
				</div>
				<div className="mt-4 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="text-2xl font-bold">{professional.name}</h1>
						<Badge className="gap-1">
							<Star className="h-3 w-3 fill-current" />
							Verificado
						</Badge>
					</div>
					{professional.specialty && (
						<Badge variant="secondary" className="text-sm px-3 py-1">
							{SPECIALTY_LABELS[professional.specialty] ??
								professional.specialty}
						</Badge>
					)}
					{professional.rating != null && (
						<ProfessionalHeroRating
							rating={professional.rating}
							consultationCount={professional.consultationCount}
						/>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
