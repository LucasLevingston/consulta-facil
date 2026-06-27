import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export interface AppointmentsDashboardProps {
	appointments: AppointmentResponse[];
}
