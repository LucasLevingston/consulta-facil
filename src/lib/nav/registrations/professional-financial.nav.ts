import { BarChart3, CreditCard, TrendingUp } from "lucide-react";
import { registerNavItem } from "../nav-registry";

registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Financeiro",
	title: "Financeiro",
	url: "/dashboard/financial",
	icon: TrendingUp,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Financeiro",
	title: "Pagamentos",
	url: "/dashboard/payments",
	icon: CreditCard,
});
registerNavItem({
	roles: ["PROFESSIONAL"],
	label: "Financeiro",
	title: "Analytics",
	url: "/dashboard/analytics",
	icon: BarChart3,
	tooltip: "Receita, consultas e avaliações por período",
});
