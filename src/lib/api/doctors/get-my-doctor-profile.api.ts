import { api } from "@/config/api";
import type { DoctorResponse } from "@/lib/schemas/doctor.schema";

export async function getMyDoctorProfileApi(): Promise<DoctorResponse> {
  const response = await api.get<DoctorResponse>("/doctors/me");
  return response.data;
}
