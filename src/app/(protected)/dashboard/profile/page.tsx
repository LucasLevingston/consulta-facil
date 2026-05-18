"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	BadgeCheck,
	Calendar,
	CalendarDays,
	Camera,
	FileText,
	Mail,
	MapPin,
	Pencil,
	Phone,
	Settings,
	Shield,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyDoctorProfile } from "@/hooks/api/doctors/use-my-doctor-profile";
import {
	usePatientAppointments,
	useDoctorAppointments,
} from "@/hooks/api/use-appointments";
import { useMyProfile } from "@/hooks/api/use-patients";
import { toast } from "@/hooks/use-toast";
import { api } from "@/config/api";
import { useUserStore } from "@/store/useUserStore";

const GENDER_LABELS: Record<string, string> = {
	MALE: "Masculino",
	FEMALE: "Feminino",
	OTHER: "Outro",
};

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

export default function ProfilePage() {
	const { user, loadUser } = useUserStore();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	const isDoctor = user?.role === "ADMIN";

	const patientQuery = usePatientAppointments(isDoctor ? "" : (user?.id ?? ""));
	const doctorQuery = useDoctorAppointments(isDoctor ? (user?.id ?? "") : "");
	const doctorProfile = useMyDoctorProfile(isDoctor);
	const patientProfile = useMyProfile();

	const appointments = isDoctor
		? (doctorQuery.data?.content ?? [])
		: (patientQuery.data?.content ?? []);

	const upcoming = appointments
		.filter(
			(a) =>
				(a.status === "CONFIRMED" || a.status === "PENDING") &&
				new Date(a.scheduledAt) >= new Date(),
		)
		.sort(
			(a, b) =>
				new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
		);

	const nextAppointment = upcoming[0];

	const initials = user?.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: user?.email?.slice(0, 2).toUpperCase() ?? "CF";

	const handleAvatarUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast({ title: "Selecione uma imagem válida.", variant: "destructive" });
			return;
		}
		const formData = new FormData();
		formData.append("file", file);
		setUploading(true);
		try {
			await api.post("/users/me/avatar", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			await loadUser();
			toast({ title: "Foto atualizada com sucesso!" });
		} catch {
			toast({ title: "Erro ao enviar a foto.", variant: "destructive" });
		} finally {
			setUploading(false);
		}
	};

	if (!user) {
		return (
			<div className="max-w-3xl mx-auto space-y-6">
				<Skeleton className="h-48 w-full rounded-3xl" />
				<Skeleton className="h-40 w-full rounded-2xl" />
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			{/* Hero */}
			<Card className="overflow-hidden">
				<div className="h-28 bg-gradient-to-br from-primary/25 via-primary/10 to-secondary/20 relative">
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
				</div>
				<CardContent className="relative pt-0 pb-6 px-6">
					<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
						<div className="relative w-fit">
							<Avatar className="size-24 rounded-2xl border-4 border-card shadow-lg">
								<AvatarImage src={user.imageUrl ?? undefined} alt={user.name} />
								<AvatarFallback className="rounded-2xl bg-primary/15 text-primary font-bold text-2xl">
									{initials}
								</AvatarFallback>
							</Avatar>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								disabled={uploading}
								className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow hover:opacity-90 transition-opacity disabled:opacity-50"
							>
								<Camera className="h-3.5 w-3.5" />
							</button>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleAvatarUpload}
							/>
						</div>

						<div className="flex gap-2 sm:mb-1">
							<Button variant="outline" size="sm" asChild className="gap-1.5 rounded-xl">
								<Link href="/settings">
									<Pencil className="h-3.5 w-3.5" />
									Editar perfil
								</Link>
							</Button>
							<Button variant="outline" size="sm" asChild className="gap-1.5 rounded-xl">
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
								{isDoctor ? "Médico" : "Paciente"}
							</Badge>
						</div>
						<p className="text-sm text-muted-foreground">{user.email}</p>
						{isDoctor && doctorProfile.data && (
							<div className="flex flex-wrap gap-2 mt-2">
								<Badge variant="outline" className="gap-1.5">
									<Shield className="h-3 w-3" />
									{doctorProfile.data.specialty}
								</Badge>
								<Badge variant="outline" className="gap-1.5 font-mono text-xs">
									CRM {doctorProfile.data.licenseNumber}
								</Badge>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Next appointment */}
			{nextAppointment && (
				<Card className="border-primary/20 bg-primary/5">
					<CardContent className="flex items-center gap-4 py-4 px-6">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
							<CalendarDays className="h-5 w-5 text-primary" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
								Próxima consulta
							</p>
							<p className="text-sm font-semibold text-foreground">
								{isDoctor
									? `Paciente: ${nextAppointment.patientName ?? "—"}`
									: `Dr. ${nextAppointment.doctorName ?? "—"}`}
							</p>
							<p className="text-xs text-muted-foreground">
								{format(
									new Date(nextAppointment.scheduledAt),
									"EEEE, d 'de' MMMM 'às' HH:mm",
									{ locale: ptBR },
								)}
							</p>
						</div>
						<Badge
							variant={
								nextAppointment.status === "CONFIRMED" ? "default" : "secondary"
							}
							className="shrink-0 rounded-full text-xs"
						>
							{nextAppointment.status === "CONFIRMED" ? "Confirmada" : "Pendente"}
						</Badge>
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{/* Personal info */}
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
								<p className="text-sm text-muted-foreground">
									Perfil incompleto
								</p>
								<Button variant="outline" size="sm" asChild className="rounded-xl">
									<Link href="/settings">Completar perfil</Link>
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Patient medical info or Doctor stats */}
				{!isDoctor ? (
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<FileText className="h-4 w-4 text-primary" />
								Informações médicas
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{patientProfile.isLoading ? (
								<div className="space-y-3">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							) : (
								<>
									<InfoRow
										icon={FileText}
										label="Alergias"
										value={(patientProfile.data as Record<string, string> | undefined)?.allergies}
									/>
									<InfoRow
										icon={FileText}
										label="Medicações"
										value={(patientProfile.data as Record<string, string> | undefined)?.currentMedication}
									/>
									<InfoRow
										icon={FileText}
										label="Histórico médico"
										value={(patientProfile.data as Record<string, string> | undefined)?.pastMedicalHistory}
									/>
									{!(patientProfile.data as Record<string, string> | undefined)?.allergies &&
										!(patientProfile.data as Record<string, string> | undefined)?.currentMedication && (
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
				) : (
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<CalendarDays className="h-4 w-4 text-primary" />
								Resumo de consultas
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{[
								{
									label: "Total",
									value: appointments.length,
									color: "text-foreground",
								},
								{
									label: "Pendentes",
									value: appointments.filter((a) => a.status === "PENDING").length,
									color: "text-yellow-500",
								},
								{
									label: "Confirmadas",
									value: appointments.filter((a) => a.status === "CONFIRMED").length,
									color: "text-green-500",
								},
								{
									label: "Concluídas",
									value: appointments.filter((a) => a.status === "COMPLETED").length,
									color: "text-blue-500",
								},
							].map(({ label, value, color }) => (
								<div key={label} className="flex items-center justify-between py-1">
									<span className="text-sm text-muted-foreground">{label}</span>
									<span className={`text-sm font-semibold ${color}`}>{value}</span>
								</div>
							))}
							<Separator />
							<Button
								variant="outline"
								size="sm"
								asChild
								className="w-full rounded-xl mt-2"
							>
								<Link href="/dashboard/appointments">Ver todas</Link>
							</Button>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4">
				{[
					{
						label: "Consultas",
						value: appointments.length,
						icon: CalendarDays,
						color: "text-primary",
						bg: "bg-primary/10",
					},
					{
						label: "Confirmadas",
						value: appointments.filter((a) => a.status === "CONFIRMED").length,
						icon: BadgeCheck,
						color: "text-green-500",
						bg: "bg-green-500/10",
					},
					{
						label: "Concluídas",
						value: appointments.filter((a) => a.status === "COMPLETED").length,
						icon: FileText,
						color: "text-blue-500",
						bg: "bg-blue-500/10",
					},
				].map(({ label, value, icon: Icon, color, bg }) => (
					<Card key={label} className="text-center">
						<CardContent className="pt-5 pb-4 space-y-2">
							<div
								className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
							>
								<Icon className={`h-5 w-5 ${color}`} />
							</div>
							<p className={`text-2xl font-bold ${color}`}>{value}</p>
							<p className="text-xs text-muted-foreground">{label}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
