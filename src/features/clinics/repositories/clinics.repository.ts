import { clinicQueueApi } from "@/lib/api/clinics/clinic-queue.api";
import { clinicStaffApi } from "@/lib/api/clinics/clinic-staff.api";
import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
import type { CreateClinicInput } from "@/lib/schemas/clinic/create-clinic.schema";
import type { InviteReceptionistInput } from "@/lib/schemas/clinic/invite-receptionist.schema";
import type { ReceptionistResponse } from "@/lib/schemas/clinic/receptionist-response.schema";

export const clinicsRepository = {
	getAll: (): Promise<ClinicResponse[]> => clinicsCrudApi.getAll(),

	getById: (id: string): Promise<ClinicResponse> => clinicsCrudApi.getById(id),

	getMy: (): Promise<ClinicResponse[]> => clinicsCrudApi.getMy(),

	getNearby: (
		lat: number,
		lng: number,
		radiusKm = 50,
	): Promise<ClinicResponse[]> => clinicsCrudApi.getNearby(lat, lng, radiusKm),

	create: (data: CreateClinicInput): Promise<ClinicResponse> =>
		clinicsCrudApi.create(data),

	update: (id: string, data: CreateClinicInput): Promise<ClinicResponse> =>
		clinicsCrudApi.update(id, data),

	addMember: (clinicId: string, professionalProfileId: string): Promise<void> =>
		clinicsCrudApi.addMember(clinicId, professionalProfileId),

	removeMember: (
		clinicId: string,
		professionalProfileId: string,
	): Promise<void> =>
		clinicsCrudApi.removeMember(clinicId, professionalProfileId),

	getReceptionists: (clinicId: string): Promise<ReceptionistResponse[]> =>
		clinicStaffApi.getReceptionists(clinicId),

	inviteReceptionist: (
		clinicId: string,
		data: InviteReceptionistInput,
	): Promise<ReceptionistResponse> =>
		clinicStaffApi.inviteReceptionist(clinicId, data),

	removeReceptionist: (
		clinicId: string,
		receptionistId: string,
	): Promise<void> =>
		clinicStaffApi.removeReceptionist(clinicId, receptionistId),

	getQueue: (clinicId: string): Promise<AppointmentResponse[]> =>
		clinicQueueApi.getQueue(clinicId),
};
