"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AppointmentDashboardFilters } from "@/components/AppointmentDashboardFilters";
import { CustomPagination } from "@/components/custom/custom-pagination";
import { makeColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import type { AppointmentStatus } from "@/features/appointments";
import { ITEMS_PER_PAGE } from "@/utils/constants/pagination";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { AppointmentsDashboardProps } from "./AppointmentDashboard.types";

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
					(a.specialty
						? (SPECIALTY_LABELS[a.specialty] ?? a.specialty)
								.toLowerCase()
								.includes(q)
						: false) ||
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
			<AppointmentDashboardFilters
				counts={counts}
				activeStatus={activeStatus}
				search={search}
				onStatusChange={(s) => updateParams({ status: s })}
				onSearchChange={(q) => updateParams({ q: q || null })}
			/>
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
