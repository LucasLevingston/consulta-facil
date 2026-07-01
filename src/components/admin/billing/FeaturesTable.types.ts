import type { FeatureResponse } from "@/features/billing";

export interface FeaturesTableProps {
	features: FeatureResponse[];
	handleDelete: (id: string) => void;
	deleting: boolean;
}
