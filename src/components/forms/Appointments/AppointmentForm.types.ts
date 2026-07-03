import type { Dispatch, SetStateAction } from "react";
import type {
	AppointmentResponse,
	VoiceBookingResult,
} from "@/features/appointments";

export interface AppointmentFormProps {
	type: "create" | "schedule" | "cancel";
	appointment?: AppointmentResponse;
	setOpen?: Dispatch<SetStateAction<boolean>>;
	voicePreset?: VoiceBookingResult | null;
}
