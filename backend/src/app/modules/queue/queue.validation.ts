// modules/queue/queue.validation.ts
import { z } from "zod";

export const createQueueSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  totalSlots: z.number().int().min(1),
  queueType: z.enum(["FIFO", "PRIORITY"]),
  isActive: z.boolean().optional(),
});
