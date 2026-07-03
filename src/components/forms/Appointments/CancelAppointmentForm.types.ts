import type { Dispatch, SetStateAction } from "react";
import type { AppointmentResponse } from "@/features/appointments";

export interface CancelAppointmentFormProps {
	appointment: AppointmentResponse;
	setOpen: Dispatch<SetStateAction<boolean>>;
}
