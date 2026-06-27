import type { Dispatch, SetStateAction } from "react";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export interface RateAppointmentFormProps {
	appointment: AppointmentResponse;
	setOpen: Dispatch<SetStateAction<boolean>>;
}
