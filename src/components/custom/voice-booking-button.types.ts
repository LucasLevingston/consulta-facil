import type { VoiceBookingResult } from "@/features/appointments";

export interface VoiceBookingButtonProps {
	onResult: (result: VoiceBookingResult) => void;
	className?: string;
}
