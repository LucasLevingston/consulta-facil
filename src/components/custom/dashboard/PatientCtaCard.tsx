"use client";

import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function PatientCtaCard() {
	return (
		<Link href="/dashboard/become-professional" className="group block">
			<Card className="border-dashed border-border transition-all hover:border-primary/40 hover:shadow-sm">
				<CardContent className="flex items-center gap-4 p-5">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
						<BadgeCheck className="h-5 w-5" />
					</div>
					<div className="flex-1">
						<p className="font-semibold text-foreground">
							É profissional de saúde?
						</p>
						<p className="text-xs text-muted-foreground">
							Cadastre-se como profissional de saúde e comece a atender
							pacientes.
						</p>
					</div>
					<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
				</CardContent>
			</Card>
		</Link>
	);
}
