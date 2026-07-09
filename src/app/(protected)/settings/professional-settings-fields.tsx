import ProfessionalDetailsForm from "@/components/forms/ProfessionalDetails/ProfessionalDetailsForm";
import { AddressForm } from "@/components/professionals/address-form";
import { BioForm } from "@/components/professionals/bio-form";
import { CertificateList } from "@/components/professionals/certificate-list";
import { CouncilForm } from "@/components/professionals/council-form";
import { EducationList } from "@/components/professionals/education-list";
import { ExperienceList } from "@/components/professionals/experience-list";
import { SocialLinksForm } from "@/components/professionals/social-links-form";
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
