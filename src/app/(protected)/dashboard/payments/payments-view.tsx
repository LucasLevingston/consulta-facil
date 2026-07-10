"use client";

import { CreditCard, Search } from "lucide-react";
import { Suspense, useDeferredValue } from "react";
import { AppointmentPaymentCard } from "@/components/custom/appointment/AppointmentPaymentCard";
import { CustomPagination } from "@/components/custom/custom-pagination";
import PageHeader from "@/components/custom/page-header";
import { useMyProfessionalProfile } from "@/components/professionals/hooks";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useAllAdminAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { usePermission } from "@/features/auth";
import { useUrlListState } from "@/hooks/use-url-list-state";
import { QueryBoundary } from "@/providers/query-boundary";
import { ITEMS_PER_PAGE as PAGE_SIZE } from "@/utils/constants/pagination";

function PaymentsContent() {
	const { role } = usePermission();
	const isAdmin = role === "ADMIN";
	const isProfessional = role === "PROFESSIONAL";

	const { page, get, updateParams } = useUrlListState();
	const search = get("q");
	const statusFilter = get("status");
	const debouncedSearch = useDeferredValue(search);

	const { data: profile } = useMyProfessionalProfile(isProfessional);
	const professionalId = profile?.id ?? "";

	const adminQuery = useAllAdminAppointments(page, PAGE_SIZE);
	const professionalQuery = useProfessionalAppointments(
		isProfessional ? professionalId : "",
		page,
		PAGE_SIZE,
	);

	const { data, isLoading, error } = isAdmin ? adminQuery : professionalQuery;

	const allAppointments = data?.content ?? [];

	const appointments = allAppointments.filter((a) => {
		const matchesSearch =
			!debouncedSearch ||
			a.patientName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
			(isAdmin &&
				a.professionalName
					?.toLowerCase()
					.includes(debouncedSearch.toLowerCase()));
		const matchesStatus = !statusFilter || a.paymentStatus === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const totalPages = data?.totalPages ?? 0;
	const totalElements = data?.totalElements ?? 0;

	const totalPaid = allAppointments
		.filter((a) => a.paymentStatus === "PAID")
		.reduce((sum, a) => sum + (a.paymentAmount ?? 0), 0);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Pagamentos"
				description={
					isAdmin
						? "Histórico de pagamentos de toda a plataforma."
						: "Histórico de pagamentos das suas consultas."
				}
				icon={<CreditCard className="h-6 w-6" />}
				count={totalElements}
				countLabel="consulta"
			/>

			{totalPaid > 0 && (
				<div className="rounded-2xl border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">
						{isAdmin ? "Total recebido na plataforma" : "Total recebido"}
					</p>
					<p className="text-2xl font-bold text-foreground">
						{totalPaid.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						})}
					</p>
				</div>
			)}

			<QueryBoundary isLoading={isLoading} error={error}>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder={
								isAdmin
									? "Buscar por paciente ou profissional..."
									: "Buscar por paciente..."
							}
							value={search}
							onChange={(e) => updateParams({ q: e.target.value || null })}
							className="pl-9 rounded-xl"
						/>
					</div>

					<Select
						value={statusFilter || "ALL"}
						onValueChange={(v) =>
							updateParams({ status: v === "ALL" ? null : v })
						}
					>
						<SelectTrigger className="w-full rounded-xl sm:w-[200px]">
							<SelectValue placeholder="Status de pagamento" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">Todos</SelectItem>
							<SelectItem value="PAID">Pago</SelectItem>
							<SelectItem value="PENDING_PAYMENT">Aguardando</SelectItem>
							<SelectItem value="UNPAID">Não pago</SelectItem>
							<SelectItem value="REFUNDED">Reembolsado</SelectItem>
							<SelectItem value="FREE">Gratuito</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{appointments.length === 0 ? (
					<div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border">
						<p className="text-sm text-muted-foreground">
							Nenhum pagamento encontrado.
						</p>
					</div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{appointments.map((a) => (
							<AppointmentPaymentCard
								key={a.id}
								appointment={a}
								showProfessionalName={isAdmin}
							/>
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

export function PaymentsView() {
	return (
		<Suspense>
			<PaymentsContent />
		</Suspense>
	);
}
