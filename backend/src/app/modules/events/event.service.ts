import { QueryBuilder } from "../../utils/QueryBuilder";
import { IEvent } from "./event.interface";
import { Event } from "./events.model";

export const createEvent = async (data: IEvent) => {
  return await Event.create(data);
};

export const getAllEvents = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Event.find(), query)
    .filter()
    .search(["title", "description"]) 
    .sort()
    .fields()
    .paginate();

  const data = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data, meta };
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
