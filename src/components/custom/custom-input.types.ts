import type { ComponentProps, ElementType } from "react";
import type { Input } from "../ui/input";

export type CustomInputProps = ComponentProps<typeof Input> & {
	icon?: ElementType;
};
