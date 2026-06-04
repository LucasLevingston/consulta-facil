export interface Plan {
	id: string;
	title: string;
	monthlyEquiv: string;
	totalPrice: string;
	period: string;
	description: string;
	features: string[];
	highlight?: boolean;
	icon: React.ReactNode;
}
