
import { Types } from "mongoose";

export type QueueType = "FIFO" | "PRIORITY";

export interface IQueue {
  title: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  totalSlots: number;
  queueType: QueueType;
  isActive: boolean;
  createdBy: Types.ObjectId;
}
