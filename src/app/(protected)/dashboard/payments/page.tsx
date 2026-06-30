"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue } from "react";
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
import type { AppointmentPaymentStatus } from "@/features/appointments";
import {
	useAllAdminAppointments,
	useProfessionalAppointments,
} from "@/features/appointments";
import { usePermission } from "@/features/auth";
import { useMyProfessionalProfile } from "@/features/professionals";
import { QueryBoundary } from "@/providers/query-boundary";
import { ITEMS_PER_PAGE as PAGE_SIZE } from "@/utils/constants/pagination";

const PAYMENT_LABELS: Record<AppointmentPaymentStatus, string> = {
	UNPAID: "Não pago",
	PENDING_PAYMENT: "Aguardando pagamento",
	PAID: "Pago",
	REFUNDED: "Reembolsado",
	FREE: "Gratuito",
};

const PAYMENT_VARIANTS: Record<
	AppointmentPaymentStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	UNPAID: "outline",
	PENDING_PAYMENT: "secondary",
	PAID: "default",
	REFUNDED: "destructive",
	FREE: "secondary",
};

function PaymentsContent() {
	const { role } = usePermission();
	const isAdmin = role === "ADMIN";
	const isProfessional = role === "PROFESSIONAL";

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const search = searchParams.get("q") ?? "";
	const statusFilter = searchParams.get("status") ?? "";
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
							<Card
								key={a.id}
								className="border-border transition-shadow hover:shadow-md"
							>
								<CardContent className="p-5">
									<div className="flex items-start justify-between gap-2">
										<div className="min-w-0 flex-1">
											<p className="truncate font-semibold text-foreground">
												{a.patientName ?? "Paciente"}
											</p>
											{isAdmin && a.professionalName && (
												<p className="truncate text-xs text-muted-foreground mt-0.5">
													{a.professionalName}
												</p>
											)}
											<p className="mt-0.5 text-xs text-muted-foreground">
												{format(
													new Date(a.scheduledAt),
													"dd/MM/yyyy 'às' HH:mm",
													{ locale: ptBR },
												)}
											</p>
										</div>

										{a.paymentStatus && (
											<Badge
												variant={PAYMENT_VARIANTS[a.paymentStatus] ?? "outline"}
												className="shrink-0 text-xs"
											>
												{PAYMENT_LABELS[a.paymentStatus] ?? a.paymentStatus}
											</Badge>
										)}
									</div>

									{a.paymentAmount != null && a.paymentAmount > 0 && (
										<p className="mt-3 text-lg font-bold text-foreground">
											{a.paymentAmount.toLocaleString("pt-BR", {
												style: "currency",
												currency: "BRL",
											})}
										</p>
									)}

									{a.serviceName && (
										<p className="mt-1 text-xs text-muted-foreground">
											{a.serviceName}
										</p>
									)}
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

export default function PaymentsPage() {
	return (
		<Suspense>
			<PaymentsContent />
		</Suspense>
	);
}
