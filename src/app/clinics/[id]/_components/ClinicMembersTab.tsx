"use client";

import { Loader2, Search, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveClinicMember } from "@/hooks/api/use-clinics";
import { useDoctors } from "@/hooks/api/use-doctors";
import { useSendClinicInvite } from "@/hooks/api/use-notifications";
import type { ClinicResponse } from "@/lib/schemas/clinic.schema";

interface Props {
  clinic: ClinicResponse;
  isManager: boolean;
  currentUserId?: string;
}

export function ClinicMembersTab({ clinic, isManager, currentUserId }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState("");

  const { data: allDoctors } = useDoctors(0, 200);
  const sendInvite = useSendClinicInvite();
  const removeMember = useRemoveClinicMember();

  const memberIds = new Set(clinic.members?.map((m) => m.doctorProfileId) ?? []);
  const availableDoctors = (allDoctors?.content ?? []).filter(
    (d) => !memberIds.has(d.id) && d.status === "ACTIVE"
  );

  const filteredAvailable = doctorSearch.trim()
    ? availableDoctors.filter(
        (d) =>
          d.name?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
          d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
      )
    : availableDoctors;

  function handleAdd(doctorProfileId: string) {
    sendInvite.mutate(
      { clinicId: clinic.id, doctorProfileId },
      {
        onSuccess: () => {
          toast.success("Convite enviado ao médico.");
          setAddOpen(false);
          setDoctorSearch("");
        },
        onError: () => toast.error("Erro ao enviar convite."),
      }
    );
  }

  function handleRemove(doctorProfileId: string, doctorName: string) {
    removeMember.mutate(
      { clinicId: clinic.id, doctorProfileId },
      {
        onSuccess: () => toast.success(`${doctorName} removido da clínica.`),
        onError: () => toast.error("Erro ao remover médico."),
      }
    );
  }

  return (
    <div className="space-y-4">
      {isManager && (
        <div className="flex justify-end">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Convidar médico
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Convidar médico</DialogTitle>
                <DialogDescription>
                  O médico receberá uma notificação para aceitar o convite.
                </DialogDescription>
              </DialogHeader>

              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou especialidade..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="mt-2 max-h-72 space-y-1 overflow-y-auto">
                {filteredAvailable.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Nenhum médico disponível encontrado.
                  </p>
                )}
                {filteredAvailable.map((doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                    onClick={() => handleAdd(doctor.id)}
                    disabled={sendInvite.isPending}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={doctor.imageUrl ?? undefined} alt={doctor.name ?? ""} />
                      <AvatarFallback className="text-xs">
                        {doctor.name?.slice(0, 2).toUpperCase() ?? "DR"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    </div>
                    {sendInvite.isPending && (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {(clinic.members ?? []).length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">
            Nenhum médico cadastrado nesta clínica.
          </p>
        )}
        {(clinic.members ?? []).map((member) => {
          const isOwnerMember = member.role === "OWNER";
          const isCurrentUser =
            currentUserId !== undefined && clinic.ownerId === currentUserId && isOwnerMember;

          return (
            <Card key={member.doctorProfileId} className="transition-shadow hover:shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={member.imageUrl ?? undefined} alt={member.doctorName ?? ""} />
                  <AvatarFallback>
                    {member.doctorName?.slice(0, 2).toUpperCase() ?? "DR"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">
                      {member.doctorName ?? "Médico"}
                    </p>
                    {isOwnerMember && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        Proprietário
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{member.specialty}</p>
                </div>

                {isManager && !isCurrentUser && !isOwnerMember && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                    onClick={() =>
                      handleRemove(member.doctorProfileId, member.doctorName ?? "Médico")
                    }
                    disabled={removeMember.isPending}
                  >
                    {removeMember.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
