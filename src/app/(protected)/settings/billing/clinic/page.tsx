import { Building2 } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import ClinicPlans from "@/components/custom/plans/ClinicPlans";

export default function ClinicBillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Plano Clínica"
        description="Expanda sua presença com o plano para clínicas."
        icon={<Building2 className="h-6 w-6" />}
      />
      <ClinicPlans />
    </div>
  );
}
