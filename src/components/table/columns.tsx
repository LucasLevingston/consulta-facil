"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/StatusBadge";
import { AppointmentActions } from "@/components/table/AppointmentActions";
import { Button } from "@/components/ui/button";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import { formatDateTime } from "@/lib/utils/format-date-time";

export function makeColumns(): ColumnDef<AppointmentResponse>[] {
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
			accessorKey: "professionalName",
			header: "Profissional",
			cell: ({ row }) => (
				<p className="text-14-medium">{row.original.professionalName ?? "—"}</p>
			),
		},
		{
			id: "actions",
			header: () => <div className="pl-4">Ações</div>,
			cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						className="gap-1.5 text-muted-foreground"
						asChild
					>
						<Link href={`/dashboard/appointments/${row.original.id}`}>
							<Eye className="h-3.5 w-3.5" />
							Ver
						</Link>
					</Button>
					<AppointmentActions appointment={row.original} />
				</div>
			),
		},
	];
}
