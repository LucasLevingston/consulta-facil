"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Search, User, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue } from "react";
import { CustomButton } from "@/components/custom/custom-button";

import { CustomPagination } from "@/components/custom/custom-pagination";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useProfessionalPatients } from "@/hooks/api/use-patients";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

type SortOption = "name" | "recent";

const PAGE_SIZE = 20;

function PatientsContent() {
	const { user } = useUserStore();
	const professionalId = user?.id ?? "";

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const search = searchParams.get("q") ?? "";
	const sort = (searchParams.get("sort") as SortOption) ?? "recent";
	const page = Number(searchParams.get("page") ?? "0");

	const debouncedSearch = useDeferredValue(search);

	function updateParams(
		updates: Record<string, string | null>,
		resetPage = true,
	) {
		const params = new URLSearchParams(searchParams.toString());
		for (const [key, value] of Object.entries(updates)) {
			if (value === null) params.delete(key);
			else params.set(key, value);
		}
		if (resetPage) params.delete("page");
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	}

	const { data, isLoading, error } = useProfessionalPatients(professionalId, {
		page,
		size: PAGE_SIZE,
		search: debouncedSearch,
		sort,
	});

	const patients = data?.content ?? [];
	const totalPages = data?.totalPages ?? 0;
	const totalElements = data?.totalElements ?? 0;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Pacientes"
				description="Lista de pacientes com consultas agendadas com você."
				icon={<UserRound className="h-6 w-6" />}
				count={totalElements}
				countLabel="paciente"
			/>

			<QueryBoundary isLoading={isLoading} error={error}>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Buscar por nome..."
							value={search}
							onChange={(e) => updateParams({ q: e.target.value || null })}
							className="pl-9 rounded-xl"
						/>
					</div>

					<Select value={sort} onValueChange={(v) => updateParams({ sort: v })}>
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
						<p className="text-sm text-muted-foreground">
							Nenhum paciente encontrado.
						</p>
					</div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{patients.map((p) => (
							<Card
								key={p.id}
								className="border-border transition-shadow hover:shadow-md"
							>
								<CardContent className="p-5">
									<div className="flex items-start gap-4">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
											<User className="h-5 w-5 text-primary" />
										</div>

										<div className="min-w-0 flex-1">
											<p className="truncate font-semibold text-foreground">
												{p.name}
											</p>

											<div className="mt-1.5 flex flex-wrap gap-2">
												<Badge variant="secondary" className="gap-1 text-xs">
													<CalendarDays className="h-3 w-3" />
													{p.totalAppointments}{" "}
													{p.totalAppointments === 1 ? "consulta" : "consultas"}
												</Badge>
											</div>

											<p className="mt-2 text-xs text-muted-foreground">
												Última:{" "}
												{format(new Date(p.lastAppointment), "dd/MM/yyyy", {
													locale: ptBR,
												})}
											</p>
										</div>
									</div>

									<div className="mt-4 flex gap-2">
										<CustomButton asChild>
											<Link href={`/dashboard/patients/${p.id}`}>
												<User />
												Ver perfil
											</Link>
										</CustomButton>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				<CustomPagination
					currentPage={page}
					totalPages={totalPages}
					onPageChange={(p) => updateParams({ page: String(p) }, false)}
					className="pt-2"
				/>
			</QueryBoundary>
		</div>
	);
}

export default function PatientsPage() {
	return (
		<Suspense>
			<PatientsContent />
		</Suspense>
	);
}
