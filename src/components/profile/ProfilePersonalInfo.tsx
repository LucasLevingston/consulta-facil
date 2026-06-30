"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Mail, Phone, Shield, User } from "lucide-react";
import Link from "next/link";

import { ProfileInfoRow } from "@/components/profile/ProfileInfoRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GENDER_LABELS } from "@/utils/constants/gender-labels";
import type { ProfilePersonalInfoProps } from "./ProfilePersonalInfo.types";

export function ProfilePersonalInfo({ user }: ProfilePersonalInfoProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base flex items-center gap-2">
					<User className="h-4 w-4 text-primary" />
					Informações pessoais
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<ProfileInfoRow icon={Mail} label="E-mail" value={user.email} />
				{user.phone && <Separator />}
				<ProfileInfoRow icon={Phone} label="Telefone" value={user.phone} />
				{user.cpf && <Separator />}
				<ProfileInfoRow icon={Shield} label="CPF" value={user.cpf} />
				{user.birthDate && <Separator />}
				<ProfileInfoRow
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
				<ProfileInfoRow
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
