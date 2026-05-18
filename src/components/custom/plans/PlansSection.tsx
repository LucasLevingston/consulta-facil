"use client";

import Plans from "./Plans";

interface PlansSectionProps {
  classname?: string;
}

export default function PlansSection({ classname }: PlansSectionProps) {
  return (
    <div
      className={`py-12 flex flex-col gap-4 md:py-24 lg:py-32 bg-mainColor ${classname}`}
    >
      <Plans />
    </div>
  );
}
