"use client";

import { useEffect, useState } from "react";

import Loading from "@/components/loading";
import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import {
  getAppointments,
  getAppointmentsByDoctorId,
  getAppointmentsByPatientId,
} from "@/lib/actions/appointment.actions";
import { ExtendUser } from "@/next-auth";
import { AppointmentCount, CompleteAppointment } from "@/types";

interface AppointmentsDashboardProps {
  user: ExtendUser;
  role: "patient" | "doctor" | "admin";
}

const AppointmentsDashboard: React.FC<AppointmentsDashboardProps> = ({ user, role }) => {
  const [appointments, setAppointments] = useState<AppointmentCount | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<CompleteAppointment[]>(
    []
  );
  const [activeType, setActiveType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  let data: AppointmentCount;
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      if (role === "patient") data = await getAppointmentsByPatientId(user.id);

      if (role === "doctor") data = await getAppointmentsByDoctorId(user.id);

      if (role === "admin") data = await getAppointments();

      if (data) {
        setAppointments(data);
        setFilteredAppointments(data.documents);
      }

      setIsLoading(false);
    };

    fetchAppointments();
  }, [user.id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!appointments) {
    return <p>Failed to load appointments. Please try again later.</p>;
  }

  const handleFilter = (type: string) => {
    const filtered = appointments.documents.filter(
      (appointment: CompleteAppointment) => appointment.status === type
    );
    setFilteredAppointments(filtered);
    setActiveType(type);
  };

  return (
    <main className="admin-main">
      <section className="admin-stat">
        <StatCard
          count={appointments.totalCount}
          label="Todas as consultas"
          icon="/assets/icons/appointments.svg"
          onClick={() => {
            setFilteredAppointments(appointments.documents);
            setActiveType(null);
          }}
          onActive={activeType === null}
        />
        <StatCard
          type="scheduled"
          count={appointments.scheduledCount}
          label="Consultas marcadas"
          icon="/assets/icons/scheduled.svg"
          onClick={() => handleFilter("scheduled")}
          onActive={activeType === "scheduled"}
        />
        <StatCard
          type="pending"
          count={appointments.pendingCount}
          label="Consultas pendentes"
          icon="/assets/icons/pending.svg"
          onClick={() => handleFilter("pending")}
          onActive={activeType === "pending"}
        />
        <StatCard
          type="canceled"
          count={appointments.cancelledCount}
          label="Consultas canceladas"
          icon="/assets/icons/cancelled.svg"
          onClick={() => handleFilter("canceled")}
          onActive={activeType === "canceled"}
        />
        <StatCard
          type="finalized"
          count={appointments.finalizedCount}
          label="Consultas finalizadas"
          icon="/assets/icons/finalized.svg"
          onClick={() => handleFilter("finalized")}
          onActive={activeType === "finalized"}
        />
      </section>

      <DataTable columns={columns} data={filteredAppointments} />
    </main>
  );
};

export default AppointmentsDashboard;
