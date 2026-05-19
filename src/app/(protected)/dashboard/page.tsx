"use client";

import { useUserStore } from "@/store/useUserStore";
import { Dashboard } from "./_components/Dashboard";

export default function DashboardPage() {
	const { user } = useUserStore();
	const role = user?.role ?? "PATIENT";
	const firstName = user?.name?.split(" ")[0] ?? "usuário";

	return <Dashboard firstName={firstName} role={role} />;
}
