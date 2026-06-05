import { z } from "zod";

export const videoRoomSchema = z.object({
	roomUrl: z.string().url(),
	token: z.string(),
	expiresAt: z.string(),
});

export type VideoRoom = z.infer<typeof videoRoomSchema>;
