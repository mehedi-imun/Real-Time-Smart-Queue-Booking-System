// modules/queue/queue.service.ts
import { Queue } from "./queue.model";
import { IQueue } from "./queue.interface";

export const createQueue = async (data: IQueue) => {
  return await Queue.create(data);
};

export const getAllQueues = async () => {
  return await Queue.find().sort({ createdAt: -1 });
};

export const getQueueById = async (id: string) => {
  return await Queue.findById(id);
};

export const updateQueue = async (id: string, payload: Partial<IQueue>) => {
  return await Queue.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteQueue = async (id: string) => {
  return await Queue.findByIdAndDelete(id);
};
