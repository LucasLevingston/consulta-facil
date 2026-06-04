import Image, { type ImageProps } from "next/image";

type LogoIconProps = Omit<ImageProps, "src" | "alt">;

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
