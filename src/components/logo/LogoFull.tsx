import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

export default function LogoFull() {
  return (
    <Button variant="ghost" className="">
      <Link className="flex items-center justify-center gap-3 p-4" href="/">
        <Image
          src="/assets/icons/logo-icon.svg"
          height={1000}
          width={1000}
          alt="patient"
          className="h-10 w-fit"
        />
        <span className="text-lg font-bold">ConsultaFácil</span>
      </Link>
    </Button>
  );
}
