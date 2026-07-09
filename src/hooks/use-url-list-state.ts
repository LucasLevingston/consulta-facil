"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlListState() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = Number(searchParams.get("page") ?? "0");

	function get(key: string) {
		return searchParams.get(key) ?? "";
	}

	function updateParams(updates: Record<string, string | null>, resetPage = true) {
		const params = new URLSearchParams(searchParams.toString());
		for (const [key, value] of Object.entries(updates)) {
			if (value === null) params.delete(key);
			else params.set(key, value);
		}
		if (resetPage) params.delete("page");
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	}

	return { page, get, updateParams };
}
