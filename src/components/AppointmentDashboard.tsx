"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Input } from "@/components/ui/input";
import type { AppointmentResponse, AppointmentStatus } from "@/lib/schemas/appointment.schema";

const PAGE_SIZE = 10;

interface AppointmentsDashboardProps {
  appointments: AppointmentResponse[];
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const AppointmentsDashboard = ({
  appointments,
  totalPages = 1,
  currentPage = 0,
  onPageChange,
}: AppointmentsDashboardProps) => {
  const [activeStatus, setActiveStatus] = useState<AppointmentStatus | null>(null);
  const [search, setSearch] = useState("");

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
          a.doctorName?.toLowerCase().includes(q) ||
          a.specialty?.toLowerCase().includes(q) ||
          a.reason?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [appointments, activeStatus, search]);

  const handleStatusClick = (status: AppointmentStatus | null) => {
    setActiveStatus(status);
    setSearch("");
    onPageChange?.(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          count={counts.total}
          label="Todas"
          icon=""
          onClick={() => handleStatusClick(null)}
          onActive={activeStatus === null}
        />
        <StatCard
          type="CONFIRMED"
          count={counts.confirmed}
          label="Confirmadas"
          icon=""
          onClick={() => handleStatusClick("CONFIRMED")}
          onActive={activeStatus === "CONFIRMED"}
        />
        <StatCard
          type="PENDING"
          count={counts.pending}
          label="Pendentes"
          icon=""
          onClick={() => handleStatusClick("PENDING")}
          onActive={activeStatus === "PENDING"}
        />
        <StatCard
          type="CANCELED"
          count={counts.canceled}
          label="Canceladas"
          icon=""
          onClick={() => handleStatusClick("CANCELED")}
          onActive={activeStatus === "CANCELED"}
        />
        <StatCard
          type="COMPLETED"
          count={counts.completed}
          label="Concluídas"
          icon=""
          onClick={() => handleStatusClick("COMPLETED")}
          onActive={activeStatus === "COMPLETED"}
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por paciente, médico, especialidade ou motivo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <DataTable columns={columns} data={filtered} />
      </div>

      {totalPages > 1 && onPageChange && (
        <AppointmentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

function AppointmentPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Página {currentPage + 1} de {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          Anterior
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = Math.max(0, currentPage - 2) + i;
          if (page >= totalPages) return null;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                page === currentPage
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted"
              }`}
            >
              {page + 1}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export { PAGE_SIZE };
export default AppointmentsDashboard;
