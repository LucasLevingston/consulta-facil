import Image from "next/image";
import type { LogoIconProps } from "./logo-icon.types";

export const LogoIcon = (props: LogoIconProps) => {
	return (
		<Image
			src="/favicon.ico"
			alt="Consulta Facil Logo"
			width={40}
			height={40}
			{...props}
		/>
	);
};
