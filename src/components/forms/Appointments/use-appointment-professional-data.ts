"use client";

import { useProfessionals } from "@/components/professionals/hooks";
import { useProfessionalSchedule } from "@/components/schedule/hooks";
import { useGetProfessionalServices } from "@/components/services/services-card/use-get-professional-services";

interface UseAppointmentProfessionalDataProps {
	selectedProfessionalId: string;
	selectedServiceId: string | null;
}

export function useAppointmentProfessionalData({
	selectedProfessionalId,
	selectedServiceId,
}: UseAppointmentProfessionalDataProps) {
	const { data: professionalsPage, isLoading: professionalsLoading } =
		useProfessionals(0, 100);
	const professionals = professionalsPage?.content ?? [];

	const selectedProfessional = professionals.find(
		(d) =>
			d.id === selectedProfessionalId || d.userId === selectedProfessionalId,
	);

	const { data: scheduleList = [], isLoading: scheduleLoading } =
		useProfessionalSchedule(selectedProfessional?.id ?? "");

	const { data: professionalServices = [] } = useGetProfessionalServices(
		selectedProfessional?.id ?? "",
	);

	const selectedService = professionalServices.find(
		(s) => s.id === selectedServiceId,
	);

	return {
		professionals,
		professionalsLoading,
		selectedProfessional,
		scheduleList,
		scheduleLoading,
		selectedService,
	};
}
