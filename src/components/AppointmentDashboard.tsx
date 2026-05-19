"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { StatCard } from "@/components/StatCard";
import { makeColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Input } from "@/components/ui/input";
import type { AppointmentResponse, AppointmentStatus } from "@/lib/schemas/appointment.schema";

const ITEMS_PER_PAGE = 10;

interface AppointmentsDashboardProps {
	appointments: AppointmentResponse[];
	userRole: "PATIENT" | "DOCTOR" | "ADMIN";
}

const AppointmentsDashboard = ({ appointments, userRole }: AppointmentsDashboardProps) => {
	const [activeStatus, setActiveStatus] = useState<AppointmentStatus | null>(null);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);

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
					a.doctorName?.toLowerCase().includes(q) ||
					a.specialty?.toLowerCase().includes(q) ||
					a.reason?.toLowerCase().includes(q),
			);
		}
		return result;
	}, [appointments, activeStatus, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
	const currentPage = Math.min(page, totalPages - 1);
	const paginated = filtered.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

	const handleStatusClick = (status: AppointmentStatus | null) => {
		setActiveStatus(status);
		setSearch("");
		setPage(0);
	};

	const columns = useMemo(() => makeColumns(userRole), [userRole]);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				<StatCard
					count={counts.total}
					label="Todas"
					icon=""
					onClick={() => handleStatusClick(null)}
					onActive={activeStatus === null}
				/>
				<StatCard
					type="CONFIRMED"
					count={counts.confirmed}
					label="Confirmadas"
					icon=""
					onClick={() => handleStatusClick("CONFIRMED")}
					onActive={activeStatus === "CONFIRMED"}
				/>
				<StatCard
					type="PENDING"
					count={counts.pending}
					label="Pendentes"
					icon=""
					onClick={() => handleStatusClick("PENDING")}
					onActive={activeStatus === "PENDING"}
				/>
				<StatCard
					type="CANCELED"
					count={counts.canceled}
					label="Canceladas"
					icon=""
					onClick={() => handleStatusClick("CANCELED")}
					onActive={activeStatus === "CANCELED"}
				/>
				<StatCard
					type="COMPLETED"
					count={counts.completed}
					label="Concluídas"
					icon=""
					onClick={() => handleStatusClick("COMPLETED")}
					onActive={activeStatus === "COMPLETED"}
				/>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Buscar por paciente, médico, especialidade ou motivo..."
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setPage(0);
					}}
					className="pl-9 rounded-xl"
				/>
			</div>

			<div className="rounded-2xl border border-border bg-card shadow-sm">
				<DataTable columns={columns} data={paginated} />
			</div>

			{totalPages > 1 && (
				<AppointmentPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}
		</div>
	);
};

function AppointmentPagination({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	return (
		<div className="flex items-center justify-between text-sm text-muted-foreground">
			<span>
				Página {currentPage + 1} de {totalPages}
			</span>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 0}
					className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
				>
					Anterior
				</button>
				{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
					const p = Math.max(0, currentPage - 2) + i;
					if (p >= totalPages) return null;
					return (
						<button
							key={p}
							type="button"
							onClick={() => onPageChange(p)}
							className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
								p === currentPage
									? "border-primary bg-primary text-primary-foreground"
									: "border-border hover:bg-muted"
							}`}
						>
							{p + 1}
						</button>
					);
				})}
				<button
					type="button"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages - 1}
					className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
				>
					Próxima
				</button>
			</div>
		</div>
	);
}

export default AppointmentsDashboard;
