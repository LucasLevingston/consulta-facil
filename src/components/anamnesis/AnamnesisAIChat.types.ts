import type { AnamnesisInput } from "@/features/appointments";

export interface AnamnesisAIChatProps {
	onSave: (data: AnamnesisInput) => Promise<void>;
	onClose: () => void;
}
