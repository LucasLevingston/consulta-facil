"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, FileText, Mail, Phone, Shield, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserResponse } from "@/lib/schemas/auth/user-response.schema";
import { GENDER_LABELS } from "@/utils/constants/gender-labels";

function InfoRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value?: string | null;
}) {
	if (!value) return null;
	return (
		<div className="flex items-start gap-3">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
				<Icon className="h-4 w-4 text-muted-foreground" />
			</div>
			<div className="min-w-0">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="text-sm font-medium break-words">{value}</p>
			</div>
		</div>
	);
}

export function ProfilePersonalInfo({ user }: { user: UserResponse }) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base flex items-center gap-2">
					<User className="h-4 w-4 text-primary" />
					Informações pessoais
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<InfoRow icon={Mail} label="E-mail" value={user.email} />
				{user.phone && <Separator />}
				<InfoRow icon={Phone} label="Telefone" value={user.phone} />
				{user.cpf && <Separator />}
				<InfoRow icon={Shield} label="CPF" value={user.cpf} />
				{user.birthDate && <Separator />}
				<InfoRow
					icon={Calendar}
					label="Data de nascimento"
					value={
						user.birthDate
							? format(new Date(user.birthDate), "dd 'de' MMMM 'de' yyyy", {
									locale: ptBR,
								})
							: undefined
					}
				/>
				{user.gender && <Separator />}
				<InfoRow
					icon={User}
					label="Gênero"
					value={user.gender ? GENDER_LABELS[user.gender] : undefined}
				/>

				{!user.phone && !user.cpf && !user.birthDate && !user.gender && (
					<div className="py-4 text-center space-y-2">
						<p className="text-sm text-muted-foreground">Perfil incompleto</p>
						<Button variant="outline" size="sm" asChild className="rounded-xl">
							<Link href="/settings">Completar perfil</Link>
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export function ProfilePatientMedicalInfo({
	patientProfile,
	isLoading,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	patientProfile: Record<string, string> | undefined | null | any;
	isLoading: boolean;
}) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base flex items-center gap-2">
					<FileText className="h-4 w-4 text-primary" />
					Informações médicas
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isLoading ? (
					<div className="space-y-3">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				) : (
					<>
						<InfoRow
							icon={FileText}
							label="Alergias"
							value={patientProfile?.allergies}
						/>
						<InfoRow
							icon={FileText}
							label="Medicações"
							value={patientProfile?.currentMedication}
						/>
						<InfoRow
							icon={FileText}
							label="Histórico médico"
							value={patientProfile?.pastMedicalHistory}
						/>
						{!patientProfile?.allergies &&
							!patientProfile?.currentMedication && (
								<div className="py-4 text-center space-y-2">
									<p className="text-sm text-muted-foreground">
										Nenhuma informação médica registrada
									</p>
									<Button
										variant="outline"
										size="sm"
										asChild
										className="rounded-xl"
									>
										<Link href="/settings">Adicionar informações</Link>
									</Button>
								</div>
							)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
