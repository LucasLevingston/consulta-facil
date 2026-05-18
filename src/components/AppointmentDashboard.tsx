"use client";

import { useState } from "react";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import type { AppointmentResponse, AppointmentStatus } from "@/lib/schemas/appointment.schema";

interface AppointmentsDashboardProps {
  appointments: AppointmentResponse[];
}

const AppointmentsDashboard = ({ appointments }: AppointmentsDashboardProps) => {
  const [activeStatus, setActiveStatus] = useState<AppointmentStatus | null>(null);

  const counts = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    canceled: appointments.filter((a) => a.status === "CANCELED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
  };

  const filtered = activeStatus
    ? appointments.filter((a) => a.status === activeStatus)
    : appointments;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          count={counts.total}
          label="Todas"
          icon=""
          onClick={() => setActiveStatus(null)}
          onActive={activeStatus === null}
        />
        <StatCard
          type="CONFIRMED"
          count={counts.confirmed}
          label="Confirmadas"
          icon=""
          onClick={() => setActiveStatus("CONFIRMED")}
          onActive={activeStatus === "CONFIRMED"}
        />
        <StatCard
          type="PENDING"
          count={counts.pending}
          label="Pendentes"
          icon=""
          onClick={() => setActiveStatus("PENDING")}
          onActive={activeStatus === "PENDING"}
        />
        <StatCard
          type="CANCELED"
          count={counts.canceled}
          label="Canceladas"
          icon=""
          onClick={() => setActiveStatus("CANCELED")}
          onActive={activeStatus === "CANCELED"}
        />
        <StatCard
          type="COMPLETED"
          count={counts.completed}
          label="Concluídas"
          icon=""
          onClick={() => setActiveStatus("COMPLETED")}
          onActive={activeStatus === "COMPLETED"}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
};

export default AppointmentsDashboard;
