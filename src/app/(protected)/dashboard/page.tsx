"use client";

import { useUserStore } from "@/store/useUserStore";
import { Dashboard } from "./_components/Dashboard";

export default function DashboardPage() {
  const { user } = useUserStore();

  return (
    <Dashboard
      firstName={user?.name?.split(" ")[0] ?? "usuário"}
      userId={user?.id ?? ""}
      isDoctor={user?.role === "ADMIN"}
    />
  );
}
