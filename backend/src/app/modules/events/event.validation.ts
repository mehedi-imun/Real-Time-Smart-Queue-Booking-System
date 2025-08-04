import { z } from "zod";
import { QueueType } from "./event.interface";

export const createEventZodSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  startsAt: z.string().datetime({ message: "Invalid start date" }),
  endsAt: z.string().datetime({ message: "Invalid end date" }),
  totalSlots: z.number().int().min(1),
  queueType: z.enum([QueueType.FIFO, QueueType.PRIORITY]),
});
