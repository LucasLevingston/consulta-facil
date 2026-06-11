export type AnamnesisMessage = {
	role: "user" | "assistant";
	content: string;
};

export type VoiceBookingResult = {
	specialty: string | null;
	professionalName: string | null;
	date: string | null;
	timePreference: "morning" | "afternoon" | "evening" | "any" | null;
	modality: "IN_PERSON" | "ONLINE" | null;
	reason: string | null;
	confidence: "high" | "medium" | "low";
	summary: string;
};
