"use client";

import { ProfessionalHeroSubtitle } from "./ProfessionalHeroSubtitle";

interface Props {
	firstName: string;
	heroLabel: string;
	isProfessional: boolean;
	isPatient: boolean;
	isAdmin: boolean;
}

export function DashboardHero({
	firstName,
	heroLabel,
	isProfessional,
	isPatient,
	isAdmin,
}: Props) {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 sm:p-8">
			<div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
			<div className="relative z-10">
				<p className="text-sm font-medium text-primary">{heroLabel}</p>
				<h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
					Olá, {firstName}!
				</h1>
				{isProfessional && <ProfessionalHeroSubtitle />}
				{isPatient && (
					<p className="mt-1 text-sm text-muted-foreground">
						O que você quer fazer hoje?
					</p>
				)}
				{isAdmin && (
					<p className="mt-1 text-sm text-muted-foreground">
						Acesso completo à plataforma.
					</p>
				)}
			</div>
		</div>
	);
}
