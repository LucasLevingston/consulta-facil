"use client";

import { ArrowRight, Building2, MapPin, Phone, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
import { CustomButton } from "../custom-button";

interface ClinicCardProps {
	clinic: ClinicResponse;
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
	const memberCount = clinic.members?.length ?? 0;

	return (
		<Card className="w-full flex flex-col hover:shadow-md transition-shadow duration-200 overflow-hidden">
			{clinic.imageUrl && (
				<div className="relative h-36 w-full shrink-0">
					<Image
						src={clinic.imageUrl}
						alt={clinic.name}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
				</div>
			)}

			<CardHeader className="pb-2">
				<div className="flex items-start gap-3">
					{!clinic.imageUrl && (
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Building2 className="h-5 w-5" />
						</div>
					)}
					<div className="min-w-0 flex-1">
						<CardTitle className="text-base leading-tight truncate">
							{clinic.name}
						</CardTitle>
						{clinic.city && (
							<p className="mt-0.5 text-xs text-muted-foreground">
								{clinic.city}
								{clinic.state ? `, ${clinic.state}` : ""}
							</p>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="grid gap-2 flex-1 pb-3">
				{clinic.description && (
					<p className="text-sm text-muted-foreground line-clamp-2">
						{clinic.description}
					</p>
				)}

				{clinic.address && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="size-3.5 shrink-0" />
						<span className="truncate">{clinic.address}</span>
					</div>
				)}

				{clinic.phone && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Phone className="size-3.5 shrink-0" />
						<span>{clinic.phone}</span>
					</div>
				)}

				{memberCount > 0 && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Users className="size-3.5 shrink-0" />
						<span>
							{memberCount} profissional{memberCount !== 1 ? "is" : ""}
						</span>
					</div>
				)}

				{clinic.members && clinic.members.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-1">
						{clinic.members.slice(0, 3).map((m) => (
							<Badge
								key={m.professionalProfileId}
								variant="secondary"
								className="text-xs"
							>
								{m.specialty}
							</Badge>
						))}
						{clinic.members.length > 3 && (
							<Badge variant="outline" className="text-xs">
								+{clinic.members.length - 3}
							</Badge>
						)}
					</div>
				)}
			</CardContent>

			<CardFooter className="pt-0 pb-3">
				<CustomButton asChild>
					<Link href={`/clinics/${clinic.id}`}>
						Ver clínica
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</CustomButton>
			</CardFooter>
		</Card>
	);
}
