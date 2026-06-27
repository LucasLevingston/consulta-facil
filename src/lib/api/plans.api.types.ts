export interface PlanResponse {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	tier: string;
	billingPeriod: "MONTHLY" | "SEMIANNUAL" | "ANNUAL";
	price: number;
	frequency: number;
	frequencyType: string;
	features: string[];
	maxAppointments: number | null;
	status: "ACTIVE" | "INACTIVE";
	displayOrder: number;
}

export interface CreatePlanValues {
	slug: string;
	name: string;
	description?: string;
	tier: string;
	billingPeriod: "MONTHLY" | "SEMIANNUAL" | "ANNUAL";
	price: number;
	maxAppointments?: number;
	displayOrder?: number;
	features?: string[];
}
