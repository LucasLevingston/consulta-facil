import { api } from "@/config/api";
import type { ProfessionalResponse } from "@/lib/schemas/doctor.schema";

export async function getMyProfessionalProfileApi(): Promise<ProfessionalResponse> {
	const response = await api.get<ProfessionalResponse>("/professionals/me");
	return response.data;
}

// Backwards-compatible alias
export const getMyDoctorProfileApi = getMyProfessionalProfileApi;
