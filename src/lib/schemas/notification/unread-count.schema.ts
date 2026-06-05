import { z } from "zod";

export const unreadCountSchema = z.object({
	count: z.number(),
});
