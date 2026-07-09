"use client";

import { Suspense } from "react";
import { UsersListContent } from "./UsersListContent";

export function UsersListView() {
	return (
		<Suspense>
			<UsersListContent />
		</Suspense>
	);
}
