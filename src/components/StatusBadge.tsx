import { Status } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";

import { StatusIcon } from "@/constants";

export const StatusBadge = ({ status }: { status: Status }) => {
  const renderStatus = (status: Status) => {
    switch (status) {
      case "scheduled":
        return <>Agendada</>;
      case "finalized":
        return <>Finalizada</>;
      case "pending":
        return <>Pendente</>;
      case "canceled":
        return <>Cancelada</>;
      default:
        return <>Desconhecido</>;
    }
  };

  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-blue-600": status === "pending",
        "bg-red-600": status === "canceled",
        "bg-yellow-600": status === "finalized",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "scheduled",
          "text-blue-500": status === "pending",
          "text-red-500": status === "canceled",
          "text-yellow-500": status === "finalized",
        })}
      >
        <div>{renderStatus(status)}</div>
      </p>
    </div>
  );
};
