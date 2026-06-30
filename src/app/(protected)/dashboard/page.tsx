"use client";

import { Dashboard } from "@/components/custom/dashboard/Dashboard";
import { useUserStore } from "@/features/auth";

export default function DashboardPage() {
	const { user } = useUserStore();
	const role = user?.role ?? "PATIENT";
	const firstName = user?.name?.split(" ")[0] ?? "usuário";

	return <Dashboard firstName={firstName} userRole={role} />;
}
