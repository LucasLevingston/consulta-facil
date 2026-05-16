"use client";

import { DoctorDetails } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { getAllDoctors } from "@/lib/actions/doctor.actions";
import { formatDateTime } from "@/lib/utils";
import { ExtendUser } from "@/next-auth";
import { CompleteAppointment } from "@/types";

import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";

export const columns: ColumnDef<CompleteAppointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Paciente",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium">{appointment.patient.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Data",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Profissional",
    cell: ({ row }) => {
      const appointment = row.original;
      const [doctors, setDoctors] = useState<DoctorDetails[]>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchDoctors = async () => {
          try {
            const fetchedDoctors = await getAllDoctors();
            setDoctors(fetchedDoctors);
          } catch (error) {
            console.error("Falha ao buscar médicos:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchDoctors();
      }, []);

      const doctor = doctors.find((doctor) => doctor.userId === appointment.doctorId);

      return (
        <div className="flex items-center gap-3">
          {loading ? (
            <Image
              src="/assets/icons/loader.svg"
              alt="Carregando"
              width={40}
              height={40}
              className="animate-spin"
            />
          ) : (
            doctor && (
              <>
                {doctor.imageProfileUrl && (
                  <img
                    src={doctor.imageProfileUrl}
                    alt="Médico"
                    className="size-12  rounded-full object-cover"
                  />
                )}
                <p className="whitespace-nowrap">Dr. {doctor.name}</p>
              </>
            )
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Ações</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      const [doctors, setDoctors] = useState<DoctorDetails[]>([]);
      const { data: session, status } = useSession();
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchDoctors = async () => {
          try {
            const fetchedDoctors = await getAllDoctors();
            setDoctors(fetchedDoctors);
          } catch (error) {
            console.error("Falha ao buscar médicos:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchDoctors();
      }, []);
      if (status === "loading" || loading) {
        return <div>Carregando...</div>;
      }

      if (status === "unauthenticated") {
        return <div>Acesso não autorizado</div>;
      }

      return (
        <div className="flex gap-1">
          <AppointmentModal
            user={session?.user as ExtendUser}
            doctors={doctors}
            appointment={appointment}
            type="schedule"
            title="Agendar Consulta"
            description="Por favor, confirme os detalhes a seguir para agendar."
          />

          <AppointmentModal
            user={session?.user as ExtendUser}
            doctors={doctors}
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
