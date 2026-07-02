"use client";

import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import { CustomButton } from "../custom-button";
import { DoctorCardInfo } from "./DoctorCardInfo";
import type { DoctorCardProps } from "./doctorCard.types";

export default function DoctorCard({
	doctor,
	isActiveAppointmentButton = true,
}: DoctorCardProps) {
	const router = useRouter();
	const initials = doctor.name
		? doctor.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: "?";
	return (
		<Card className="flex w-full flex-col transition-shadow duration-200 hover:shadow-md">
			<CardHeader className="flex flex-row items-center gap-4 pb-3">
				<Avatar className="size-14 rounded-xl border border-border">
					<AvatarImage
						src={doctor.imageUrl ?? undefined}
						alt={doctor.name ?? "Profissional"}
					/>
					<AvatarFallback className="rounded-xl bg-primary/10 text-sm font-bold text-primary">
						{initials}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<Link href={`/professionals/${doctor.id}`}>
						<CardTitle className="truncate text-base leading-tight transition-colors hover:text-primary">
							{doctor.name ?? "Nome não informado"}
						</CardTitle>
					</Link>
					<Badge variant="secondary" className="mt-1.5 text-xs">
						{doctor.specialty
							? (SPECIALTY_LABELS[doctor.specialty] ?? doctor.specialty)
							: "Especialidade não informada"}
					</Badge>
				</div>
			</CardHeader>
			<DoctorCardInfo doctor={doctor} />
			{isActiveAppointmentButton && (
				<CardFooter className="pt-0">
					<CustomButton
						className="w-full"
						onClick={() => router.push(`/professionals/${doctor.id}`)}
					>
						<Stethoscope className="size-4" />
						Ver profissonal{" "}
					</CustomButton>
				</CardFooter>
			)}
		</Card>
	);
}
