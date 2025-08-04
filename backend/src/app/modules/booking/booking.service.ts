import { Event } from "../events/events.model";
import { Booking } from "./booking.model";
import { bookingQueue } from "./booking.worker";

export const enqueueBookingRequest = async ({
  eventId,
  userId,
  socketId,
}: {
  eventId: string;
  userId: string;
  socketId: string;
}) => {
  await bookingQueue.add("enqueue", { eventId, userId, socketId });
};

export const createBooking = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  const existing = await Booking.findOne({ user: userId, event: eventId });
  if (existing) throw new Error("Already booked");

  const totalBookings = await Booking.countDocuments({ event: eventId });
  if (totalBookings >= event.totalSlots) {
    throw new Error("No slots available");
  }
  const booking = await Booking.create({ event: eventId, user: userId });
  event.totalSlots = event.totalSlots - 1;
  await event.save();
  return booking;
};
