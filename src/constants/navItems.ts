import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Consultas",
    url: "/admin/consultas",
    icon: "dashboard",
    isActive: false,
    items: [],
  },
  {
    title: "Estatísticas",
    url: "/admin/employee",
    icon: "user",
    isActive: false,
    items: [],
  },
  {
    title: "Planos",
    url: "/admin/planos",
    icon: "product",
    isActive: false,
    items: [],
  },
  {
    title: "Transações",
    url: "/admin/transacoes",
    icon: "billing",
    isActive: true,

    items: [
      {
        title: "Assinaturas",
        url: "/admin/transacoes/assinaturas",
        icon: "userPen",
      },
      {
        title: "Reembolsos",
        url: "/admin/transacoes/reembolsos",
        icon: "login",
      },
    ],
  },
];
