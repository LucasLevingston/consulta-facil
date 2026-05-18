"use client";

import { Settings } from "lucide-react";

import DoctorDetailsForm from "@/components/custom/forms/DoctorDetails/DoctorDetailsForm";
import PatientDetailsForm from "@/components/custom/forms/PatientDetails/PatientDetailsForm";
import PageHeader from "@/components/custom/page-header";
import { useUserStore } from "@/store/useUserStore";

export default function SettingsPage() {
  const { user } = useUserStore();

  const isDoctor = user?.role === "DOCTOR" || user?.role === "ADMIN";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie suas informações pessoais e preferências."
        icon={<Settings className="h-6 w-6" />}
      />

      <div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          {isDoctor ? (
            <DoctorDetailsForm userId={user?.id ?? ""} userEmail={user?.email ?? ""} type="edit" />
          ) : (
            <PatientDetailsForm userId={user?.id ?? ""} userEmail={user?.email ?? ""} type="edit" />
          )}
        </div>
      </div>
    </div>
  );
}
