"use client";

import {
	usePatientAppointments,
	useProfessionalAppointments,
} from "@/components/appointments/hooks";
import { useMyProfessionalProfile } from "@/components/professionals/hooks";
import { ProfileAppointmentStats } from "@/components/profile/profile-appointment-stats";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileNextAppointment } from "@/components/profile/profile-next-appointment";
import { ProfilePatientMedicalInfo } from "@/components/profile/profile-patient-medical-info";
import { ProfilePersonalInfo } from "@/components/profile/profile-personal-info";
import { ProfileStatsBanner } from "@/components/profile/profile-stats-banner";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/features/auth";
import { QueryBoundary } from "@/providers/query-boundary";
import { useMyProfile } from "./use-my-profile";

export function ProfileView() {
	const { user } = useUserStore();

	const isProfessional =
		user?.role === "PROFESSIONAL" || user?.role === "ADMIN";

	const patientQuery = usePatientAppointments(
		isProfessional ? "" : (user?.id ?? ""),
	);
	const professionalQuery = useProfessionalAppointments(
		isProfessional ? (user?.id ?? "") : "",
	);
	const professionalProfile = useMyProfessionalProfile(isProfessional);
	const patientProfile = useMyProfile(!isProfessional);

	const appointments = isProfessional
		? (professionalQuery.data?.content ?? [])
		: (patientQuery.data?.content ?? []);

	const nextAppointment = appointments
		.filter(
			(a) =>
				(a.status === "CONFIRMED" || a.status === "PENDING") &&
				new Date(a.scheduledAt) >= new Date(),
		)
		.sort(
			(a, b) =>
				new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
		)[0];

	if (!user) {
		return (
			<div className="max-w-3xl mx-auto space-y-6">
				<Skeleton className="h-48 w-full rounded-3xl" />
				<Skeleton className="h-40 w-full rounded-2xl" />
			</div>
		);
	}

	return (
		<QueryBoundary
			isLoading={patientQuery.isLoading || professionalQuery.isLoading}
			error={patientQuery.error || professionalQuery.error}
		>
			<div className="max-w-3xl mx-auto space-y-6">
				<ProfileHero
					user={user}
					isProfessional={isProfessional}
					professionalData={professionalProfile.data}
				/>

				{nextAppointment && (
					<ProfileNextAppointment
						appointment={nextAppointment}
						isProfessional={isProfessional}
					/>
				)}

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<ProfilePersonalInfo user={user} />
					{isProfessional ? (
						<ProfileAppointmentStats appointments={appointments} />
					) : (
						<ProfilePatientMedicalInfo
							patientProfile={patientProfile.data}
							isLoading={patientProfile.isLoading}
						/>
					)}
				</div>

				<ProfileStatsBanner appointments={appointments} />
			</div>
		</QueryBoundary>
	);
}
