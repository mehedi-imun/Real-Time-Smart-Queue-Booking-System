export enum QueueType {
  FIFO = "FIFO",
  PRIORITY = "PRIORITY",
}

export interface IEvent {
  _id?: string;
  title: string;
  image?: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  totalSlots: number;
  queueType: QueueType;
  isActive: boolean;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
