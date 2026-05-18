"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, FileText, Search, User, UserRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDoctorAppointments } from "@/hooks/api/use-appointments";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

type SortOption = "name" | "recent";

export default function PatientsPage() {
	const { user } = useUserStore();
	const doctorId = user?.id ?? "";

	const { data, isLoading, error } = useDoctorAppointments(doctorId, 0, 200);

	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<SortOption>("recent");

	const patients = useMemo(() => {
		const map = new Map<
			string,
			{ id: string; name: string; lastAppointment: string; totalAppointments: number }
		>();

		for (const a of data?.content ?? []) {
			const existing = map.get(a.patientId);
			if (!existing) {
				map.set(a.patientId, {
					id: a.patientId,
					name: a.patientName ?? "Paciente",
					lastAppointment: a.scheduledAt,
					totalAppointments: 1,
				});
			} else {
				existing.totalAppointments += 1;
				if (new Date(a.scheduledAt) > new Date(existing.lastAppointment)) {
					existing.lastAppointment = a.scheduledAt;
				}
			}
		}

		let result = Array.from(map.values()).filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase()),
		);

		if (sort === "name") result = result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
		else result = result.sort((a, b) => new Date(b.lastAppointment).getTime() - new Date(a.lastAppointment).getTime());

		return result;
	}, [data, search, sort]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Pacientes"
				description="Lista de pacientes com consultas agendadas com você."
				icon={<UserRound className="h-6 w-6" />}
				count={patients.length}
				countLabel="paciente"
			/>

			<QueryBoundary isLoading={isLoading} error={error}>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Buscar por nome..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 rounded-xl"
						/>
					</div>

					<Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
						<SelectTrigger className="w-full rounded-xl sm:w-[180px]">
							<SelectValue placeholder="Ordenar por" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="recent">Consulta mais recente</SelectItem>
							<SelectItem value="name">Nome (A–Z)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{patients.length === 0 ? (
					<div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border">
						<p className="text-sm text-muted-foreground">Nenhum paciente encontrado.</p>
					</div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{patients.map((p) => (
							<Card key={p.id} className="border-border transition-shadow hover:shadow-md">
								<CardContent className="p-5">
									<div className="flex items-start gap-4">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
											<User className="h-5 w-5 text-primary" />
										</div>

										<div className="min-w-0 flex-1">
											<p className="truncate font-semibold text-foreground">{p.name}</p>

											<div className="mt-1.5 flex flex-wrap gap-2">
												<Badge variant="secondary" className="gap-1 text-xs">
													<CalendarDays className="h-3 w-3" />
													{p.totalAppointments}{" "}
													{p.totalAppointments === 1 ? "consulta" : "consultas"}
												</Badge>
											</div>

											<p className="mt-2 text-xs text-muted-foreground">
												Última:{" "}
												{format(new Date(p.lastAppointment), "dd/MM/yyyy", { locale: ptBR })}
											</p>
										</div>
									</div>

									<div className="mt-4 flex gap-2">
										<Button variant="outline" size="sm" className="flex-1 rounded-xl gap-1.5" asChild>
											<Link href={`/dashboard/records?patient=${p.id}`}>
												<FileText className="h-3.5 w-3.5" />
												Prontuário
											</Link>
										</Button>
										<Button variant="outline" size="sm" className="flex-1 rounded-xl gap-1.5" asChild>
											<Link href={`/dashboard/appointments?patient=${p.id}`}>
												<CalendarDays className="h-3.5 w-3.5" />
												Consultas
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</QueryBoundary>
		</div>
	);
}
