"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge } from "@/components/StatusBadge";
import { AppointmentActions } from "@/components/table/AppointmentActions";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";
import { formatDateTime } from "@/lib/utils";

export function makeColumns(userRole: "PATIENT" | "DOCTOR" | "ADMIN"): ColumnDef<AppointmentResponse>[] {
	return [
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
			cell: ({ row }) => (
				<AppointmentActions appointment={row.original} userRole={userRole} />
			),
		},
	];
}
