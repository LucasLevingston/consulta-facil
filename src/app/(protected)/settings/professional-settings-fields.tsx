import ProfessionalDetailsForm from "@/components/forms/ProfessionalDetails/ProfessionalDetailsForm";
import { AddressForm } from "@/components/professionals/AddressForm";
import { BioForm } from "@/components/professionals/BioForm";
import { CertificateList } from "@/components/professionals/CertificateList";
import { CouncilForm } from "@/components/professionals/CouncilForm";
import { EducationList } from "@/components/professionals/EducationList";
import { ExperienceList } from "@/components/professionals/ExperienceList";
import { SocialLinksForm } from "@/components/professionals/SocialLinksForm";
import type { ProfessionalResponse } from "@/features/professionals";

export function ProfessionalSettingsFields({
	userId,
	userEmail,
	profile,
}: {
	userId: string;
	userEmail: string;
	profile: ProfessionalResponse | undefined;
}) {
	return (
		<>
			<div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
				<ProfessionalDetailsForm
					userId={userId}
					userEmail={userEmail}
					type="edit"
				/>
			</div>
			{profile && <BioForm professional={profile} />}
			{profile && <SocialLinksForm professional={profile} />}
			{profile && <CouncilForm professional={profile} />}
			{profile && <AddressForm professional={profile} />}
			{profile && <EducationList professional={profile} />}
			{profile && <ExperienceList professional={profile} />}
			{profile && <CertificateList professional={profile} />}
		</>
	);
}
