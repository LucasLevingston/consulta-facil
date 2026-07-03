import { api } from "@/config/api";
import type { ProfessionalResponse } from "@/lib/schemas/professional/professional-response.schema";

export async function getMyProfessionalProfileApi(): Promise<ProfessionalResponse> {
	const response = await api.get<ProfessionalResponse>("/professionals/me");
	return response.data;
}
