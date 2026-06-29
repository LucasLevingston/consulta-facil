"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Shield, User, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue, useEffect } from "react";
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
import { useAllUsers } from "@/features/users";
import { usePermission } from "@/hooks/use-permission";
import { QueryBoundary } from "@/providers/query-boundary";
import { ITEMS_PER_PAGE as PAGE_SIZE } from "@/utils/constants/pagination";

const ROLE_LABELS: Record<string, string> = {
	PATIENT: "Paciente",
	PROFESSIONAL: "Profissional",
	ADMIN: "Admin",
	RECEPTIONIST: "Recepcionista",
};

const ROLE_VARIANTS: Record<
	string,
	"default" | "secondary" | "destructive" | "outline"
> = {
	PATIENT: "secondary",
	PROFESSIONAL: "default",
	ADMIN: "destructive",
	RECEPTIONIST: "outline",
};

function UsersContent() {
	const { can } = usePermission();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (!can("admin:access")) router.push("/dashboard");
	}, [can, router]);

	const search = searchParams.get("q") ?? "";
	const roleFilter = searchParams.get("role") ?? "";
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

	const { data, isLoading, error } = useAllUsers(
		page,
		PAGE_SIZE,
		roleFilter || undefined,
	);

	const users = (data?.content ?? []).filter(
		(u) =>
			!debouncedSearch ||
			u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
			u.email?.toLowerCase().includes(debouncedSearch.toLowerCase()),
	);
	const totalPages = data?.totalPages ?? 0;
	const totalElements = data?.totalElements ?? 0;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Usuários"
				description="Lista de todos os usuários cadastrados na plataforma."
				icon={<Users className="h-6 w-6" />}
				count={totalElements}
				countLabel="usuário"
			/>

			<QueryBoundary isLoading={isLoading} error={error}>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Buscar por nome ou email..."
							value={search}
							onChange={(e) => updateParams({ q: e.target.value || null })}
							className="pl-9 rounded-xl"
						/>
					</div>

					<Select
						value={roleFilter || "ALL"}
						onValueChange={(v) =>
							updateParams({ role: v === "ALL" ? null : v })
						}
					>
						<SelectTrigger className="w-full rounded-xl sm:w-[180px]">
							<SelectValue placeholder="Filtrar por tipo" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">Todos</SelectItem>
							<SelectItem value="PATIENT">Pacientes</SelectItem>
							<SelectItem value="PROFESSIONAL">Profissionais</SelectItem>
							<SelectItem value="ADMIN">Admins</SelectItem>
							<SelectItem value="RECEPTIONIST">Recepcionistas</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{users.length === 0 ? (
					<div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border">
						<p className="text-sm text-muted-foreground">
							Nenhum usuário encontrado.
						</p>
					</div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{users.map((u) => (
							<Card
								key={u.id}
								className="border-border transition-shadow hover:shadow-md"
							>
								<CardContent className="p-5">
									<div className="flex items-start gap-4">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
											{u.role === "ADMIN" ? (
												<Shield className="h-5 w-5 text-primary" />
											) : (
												<User className="h-5 w-5 text-primary" />
											)}
										</div>

										<div className="min-w-0 flex-1">
											<p className="truncate font-semibold text-foreground">
												{u.name ?? "—"}
											</p>
											<p className="truncate text-xs text-muted-foreground mt-0.5">
												{u.email ?? "—"}
											</p>

											<div className="mt-2 flex flex-wrap gap-2">
												{u.role && (
													<Badge
														variant={ROLE_VARIANTS[u.role] ?? "secondary"}
														className="text-xs"
													>
														{ROLE_LABELS[u.role] ?? u.role}
													</Badge>
												)}
											</div>

											{u.createdAt && (
												<p className="mt-2 text-xs text-muted-foreground">
													Cadastro:{" "}
													{format(new Date(u.createdAt), "dd/MM/yyyy", {
														locale: ptBR,
													})}
												</p>
											)}
										</div>
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

export default function AdminUsersPage() {
	return (
		<Suspense>
			<UsersContent />
		</Suspense>
	);
}
