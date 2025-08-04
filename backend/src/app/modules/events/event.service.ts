import { IEvent } from "./event.interface";
import { Event } from "./events.model";

export const createEvent = async (data: IEvent) => {
  console.log(data)
  return await Event.create(data);
};

export const getAllEvents = async () => {
  return await Event.find().sort({ createdAt: -1 });
};

export const getEventById = async (id: string) => {
  return await Event.findById(id);
};

export const updateEvent = async (id: string, update: Partial<IEvent>) => {
  return await Event.findByIdAndUpdate(id, update, { new: true });
};

export const deleteEvent = async (id: string) => {
  return await Event.findByIdAndDelete(id);
};
