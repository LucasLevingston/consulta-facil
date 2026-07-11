"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect } from "react";
import { usePermission } from "@/components/auth/hooks";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { useUrlListState } from "@/hooks/use-url-list-state";
import { UsersListBody } from "./UsersListBody";

export function UsersListContent() {
	const { can } = usePermission();
	const router = useRouter();

	useEffect(() => {
		if (!can("admin:access")) router.push("/dashboard");
	}, [can, router]);

	const { page, get, updateParams } = useUrlListState();
	const search = get("q");
	const roleFilter = get("role");
	const debouncedSearch = useDeferredValue(search);

	return (
		<SuspenseBoundary>
			<UsersListBody
				page={page}
				roleFilter={roleFilter}
				search={search}
				debouncedSearch={debouncedSearch}
				updateParams={updateParams}
			/>
		</SuspenseBoundary>
	);
}
