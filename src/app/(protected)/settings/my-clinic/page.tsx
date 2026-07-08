export const dynamic = "force-dynamic";

import { Building2 } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { MyClinicContent } from "../../../../components/custom/clinic/MyClinicContent";

export default function MyClinicPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Minha Clínica"
				description="Crie e gerencie as informações da sua clínica."
				icon={<Building2 className="h-6 w-6" />}
			/>
			<SuspenseBoundary>
				<MyClinicContent />
			</SuspenseBoundary>
		</div>
	);
}
