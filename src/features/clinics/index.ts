export { clinicsRepository } from "@/features/clinics/repositories/clinics.repository";
export type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
export {
	type CreateClinicInput,
	createClinicSchema,
} from "@/lib/schemas/clinic/create-clinic.schema";
export {
	type InviteReceptionistInput,
	inviteReceptionistSchema,
} from "@/lib/schemas/clinic/invite-receptionist.schema";
