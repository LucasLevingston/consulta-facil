import type { Dispatch, SetStateAction } from "react";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { VoiceBookingResult } from "@/lib/types/ai";

export interface UseAppointmentFormSetupProps {
	type: "create" | "schedule" | "cancel";
	appointment?: AppointmentResponse;
	setOpen?: Dispatch<SetStateAction<boolean>>;
	voicePreset?: VoiceBookingResult | null;
}
