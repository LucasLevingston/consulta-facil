import type { VoiceBookingResult } from "@/lib/types/ai";

export interface VoiceBookingButtonProps {
	onResult: (result: VoiceBookingResult) => void;
	className?: string;
}
