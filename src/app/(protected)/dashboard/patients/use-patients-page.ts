"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue } from "react";
import { useProfessionalPatients } from "@/components/patients/hooks";
import { usePermission, useUserStore } from "@/features/auth";
import { ITEMS_PER_PAGE as PAGE_SIZE } from "@/utils/constants/pagination";
import { useAllAdminPatients } from "./use-all-admin-patients";

type SortOption = "name" | "recent";

export function usePatientsPage() {
	const { user } = useUserStore();
	const { role } = usePermission();
	const isAdmin = role === "ADMIN";
	const professionalId = role === "PROFESSIONAL" ? (user?.id ?? "") : "";

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

	const queryParams = { page, size: PAGE_SIZE, search: debouncedSearch, sort };

	const adminQuery = useAllAdminPatients(queryParams);
	const professionalQuery = useProfessionalPatients(
		professionalId,
		queryParams,
	);

	const { data, isLoading, error } = isAdmin ? adminQuery : professionalQuery;

	const patients = data?.content ?? [];
	const totalPages = data?.totalPages ?? 0;
	const totalElements = data?.totalElements ?? 0;

	return {
		patients,
		totalPages,
		totalElements,
		page,
		search,
		sort,
		isLoading,
		error,
		isAdmin,
		updateParams,
	};
}
