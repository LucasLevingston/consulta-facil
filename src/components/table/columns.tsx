"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AppointmentModal } from "@/components/AppointmentModal";
import { StatusBadge } from "@/components/StatusBadge";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";
import { formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

export const columns: ColumnDef<AppointmentResponse>[] = [
  {
    header: "#",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patientName",
    header: "Paciente",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.original.patientName ?? "—"}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "scheduledAt",
    header: "Data",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(new Date(row.original.scheduledAt)).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "doctorName",
    header: "Profissional",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row.original.doctorName ? `Dr. ${row.original.doctorName}` : "—"}
      </p>
    ),
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Ações</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { isAuthenticated } = useAuthStore();

      if (!isAuthenticated) return null;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            appointment={appointment}
            type="schedule"
            title="Agendar Consulta"
            description="Por favor, confirme os detalhes a seguir para agendar."
          />
          <AppointmentModal
            appointment={appointment}
            type="cancel"
            title="Cancelar Consulta"
            description="Tem certeza de que deseja cancelar sua consulta?"
          />
        </div>
      );
    },
  },
];
