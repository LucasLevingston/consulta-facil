"use client";

import { ArrowRight, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomButton } from "../custom-button";
import type { ClinicCardProps } from "./ClinicCard.types";
import { ClinicCardContent } from "./ClinicCardContent";

export default function ClinicCard({ clinic }: ClinicCardProps) {
	return (
		<Card className="flex w-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md">
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
						<CardTitle className="truncate text-base leading-tight">
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
			<ClinicCardContent clinic={clinic} />
			<CardFooter className="pb-3 pt-0">
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
