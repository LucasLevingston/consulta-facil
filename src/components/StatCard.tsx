"use client";

import { Status } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";

type StatCardProps = {
  type?: Status;
  count: number;
  label: string;
  icon: string;
  onClick?: () => void;
  onActive: boolean;
};

export const StatCard = ({
  count = 0,
  label,
  icon,
  type,
  onClick,
  onActive,
}: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-scheduled": type === "scheduled",
        "bg-pending": type === "pending",
        "bg-canceled": type === "canceled",
        "bg-finalized": type === "finalized",
        "bg-all": !type,
        "opacity-50": onActive,
      })}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt="appointments"
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};
