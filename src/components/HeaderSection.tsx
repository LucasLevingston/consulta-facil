import React from "react";

import LogoFull from "./logo/LogoFull";

interface HeaderSectionProps {
  label?: string | React.ReactNode;
}

export default function HeaderSection({ label }: HeaderSectionProps) {
  return (
    <div>
      <header className="admin-header">
        <LogoFull />
        <p className="text-16-semibold flex items-center gap-2">{label}</p>
      </header>
    </div>
  );
}
