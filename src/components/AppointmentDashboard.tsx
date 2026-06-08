"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CustomPagination } from "@/components/custom/custom-pagination";
import { StatCard } from "@/components/StatCard";
import { makeColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Input } from "@/components/ui/input";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { AppointmentStatus } from "@/lib/schemas/appointment/appointment-status.schema";

import { ITEMS_PER_PAGE } from "@/utils/constants/pagination";

interface AppointmentsDashboardProps {
	appointments: AppointmentResponse[];
}

const AppointmentsDashboard = ({
	appointments,
}: AppointmentsDashboardProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const search = searchParams.get("q") ?? "";
	const activeStatus =
		(searchParams.get("status") as AppointmentStatus) || null;
	const page = Number(searchParams.get("page") ?? "0");

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

	const counts = {
		total: appointments.length,
		confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
		pending: appointments.filter((a) => a.status === "PENDING").length,
		canceled: appointments.filter((a) => a.status === "CANCELED").length,
		completed: appointments.filter((a) => a.status === "COMPLETED").length,
	};

	const filtered = useMemo(() => {
		let result = appointments;
		if (activeStatus) result = result.filter((a) => a.status === activeStatus);
		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter(
				(a) =>
					a.patientName?.toLowerCase().includes(q) ||
					a.professionalName?.toLowerCase().includes(q) ||
					a.specialty?.toLowerCase().includes(q) ||
					a.reason?.toLowerCase().includes(q),
			);
		}
		return result;
	}, [appointments, activeStatus, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
	const currentPage = Math.min(page, totalPages - 1);
	const paginated = filtered.slice(
		currentPage * ITEMS_PER_PAGE,
		(currentPage + 1) * ITEMS_PER_PAGE,
	);

	const columns = useMemo(() => makeColumns(), []);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				<StatCard
					count={counts.total}
					label="Todas"
					icon=""
					onClick={() => updateParams({ status: null })}
					onActive={activeStatus === null}
				/>
				<StatCard
					type="CONFIRMED"
					count={counts.confirmed}
					label="Confirmadas"
					icon=""
					onClick={() => updateParams({ status: "CONFIRMED" })}
					onActive={activeStatus === "CONFIRMED"}
				/>
				<StatCard
					type="PENDING"
					count={counts.pending}
					label="Pendentes"
					icon=""
					onClick={() => updateParams({ status: "PENDING" })}
					onActive={activeStatus === "PENDING"}
				/>
				<StatCard
					type="CANCELED"
					count={counts.canceled}
					label="Canceladas"
					icon=""
					onClick={() => updateParams({ status: "CANCELED" })}
					onActive={activeStatus === "CANCELED"}
				/>
				<StatCard
					type="COMPLETED"
					count={counts.completed}
					label="Concluídas"
					icon=""
					onClick={() => updateParams({ status: "COMPLETED" })}
					onActive={activeStatus === "COMPLETED"}
				/>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Buscar por paciente, profissional, especialidade ou motivo..."
					value={search}
					onChange={(e) => updateParams({ q: e.target.value || null })}
					className="pl-9 rounded-xl"
				/>
			</div>

			<div className="rounded-2xl border border-border bg-card shadow-sm">
				<DataTable columns={columns} data={paginated} />
			</div>

			<CustomPagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={(p) => updateParams({ page: String(p) }, false)}
			/>
		</div>
	);
};

export default AppointmentsDashboard;
