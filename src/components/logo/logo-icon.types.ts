import type { ImageProps } from "next/image";

export type LogoIconProps = Omit<ImageProps, "src" | "alt">;
