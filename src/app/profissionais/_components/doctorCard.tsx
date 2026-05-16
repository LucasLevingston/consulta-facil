"use client";

import { DoctorDetails } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Phone, Mail, FileCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DoctorCardProps {
  doctor: DoctorDetails;
  isActiveAppointmentButton?: boolean;
}

export default function DoctorCard({
  doctor,
  isActiveAppointmentButton = true,
}: DoctorCardProps) {
  const route = useRouter();
  const handleRedirect = () => {
    route.push(`/agendar-consulta?doctorid=${doctor.userId}`);
  };
  return (
    <Card className="w-full max-w-sm dark:bg-dark-400">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage
            src={doctor.imageProfileUrl!}
            alt={doctor.name || "Doctor"}
            className="size-16 rounded-full object-cover"
          />
          <AvatarFallback>
            {doctor.name
              ? doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : doctor.gender === "male"
                ? "Dr."
                : "Dra."}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link href={`/profissionais/${doctor.userId}`}>
            <CardTitle>
              {doctor.gender === "female" ? "Dra. " : "Dr. "}
              {doctor.name || "Nome não informado"}
            </CardTitle>
          </Link>
          <Badge variant="secondary" className="mt-1">
            {doctor.specialty || "Especialidade não informada"}
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
          <Button className="w-full" onClick={handleRedirect}>
            Agendar Consulta
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
