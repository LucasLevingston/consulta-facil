"use client";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { FileCheck, Mail, Phone, StethoscopeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DoctorResponse } from "@/lib/schemas/doctor.schema";
import { CustomButton } from "../custom-button";

interface DoctorCardProps {
  doctor: DoctorResponse;
  isActiveAppointmentButton?: boolean;
}

export default function DoctorCard({
  doctor,
  isActiveAppointmentButton = true,
}: DoctorCardProps) {
  const router = useRouter();

  return (
    <Card className="w-full max-w-sm dark:bg-dark-400">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback>
            {doctor.name
              ? doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "Dr"}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link href={`/profissionais/${doctor.userId}`}>
            <CardTitle>Dr. {doctor.name ?? "Nome não informado"}</CardTitle>
          </Link>
          <Badge variant="secondary" className="mt-1">
            {doctor.specialty ?? "Especialidade não informada"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        {doctor.phone && (
          <div className="flex items-center gap-2">
            <Phone className="text-muted-foreground size-4" />
            <span>{doctor.phone}</span>
          </div>
        )}
        {doctor.email && (
          <div className="flex items-center gap-2">
            <Mail className="text-muted-foreground size-4" />
            <span>{doctor.email}</span>
          </div>
        )}
        {doctor.licenseNumber && (
          <div className="flex items-center gap-2">
            <FileCheck className="text-muted-foreground size-4" />
            <span>CRM: {doctor.licenseNumber}</span>
          </div>
        )}
      </CardContent>
      {isActiveAppointmentButton && (
        <CardFooter>
          <CustomButton
            className="w-full"
            onClick={() => router.push(`/agendar-consulta?doctorid=${doctor.userId}`)}
          >
            <StethoscopeIcon />
            Agendar Consulta
          </CustomButton>
        </CardFooter>
      )}
    </Card>
  );
}
