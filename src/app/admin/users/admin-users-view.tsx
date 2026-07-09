"use client";

import { Search, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue, useEffect } from "react";
import { CustomPagination } from "@/components/custom/custom-pagination";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { UserRoleCard } from "@/components/custom/user/UserRoleCard";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePermission } from "@/features/auth";
import { useAllUsers } from "@/features/users";
import { ITEMS_PER_PAGE as PAGE_SIZE } from "@/utils/constants/pagination";
import type { UsersPageBodyProps } from "./admin-users-view.types";

function UsersPageBody({
	page,
	roleFilter,
	search,
	debouncedSearch,
	updateParams,
}: UsersPageBodyProps) {
	const { data } = useAllUsers(page, PAGE_SIZE, roleFilter || undefined);

	const users = data.content.filter(
		(u) =>
			!debouncedSearch ||
			u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
			u.email?.toLowerCase().includes(debouncedSearch.toLowerCase()),
	);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Usuários"
				description="Lista de todos os usuários cadastrados na plataforma."
				icon={<Users className="h-6 w-6" />}
				count={data.totalElements}
				countLabel="usuário"
			/>

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
					onValueChange={(v) => updateParams({ role: v === "ALL" ? null : v })}
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
						<UserRoleCard key={u.id} user={u} />
					))}
				</div>
			)}

			<CustomPagination
				currentPage={page}
				totalPages={data.totalPages}
				onPageChange={(p) => updateParams({ page: String(p) }, false)}
				className="pt-2"
			/>
		</div>
	);
}

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

	return (
		<SuspenseBoundary>
			<UsersPageBody
				page={page}
				roleFilter={roleFilter}
				search={search}
				debouncedSearch={debouncedSearch}
				updateParams={updateParams}
			/>
		</SuspenseBoundary>
	);
}

export function AdminUsersView() {
	return (
		<Suspense>
			<UsersContent />
		</Suspense>
	);
}
