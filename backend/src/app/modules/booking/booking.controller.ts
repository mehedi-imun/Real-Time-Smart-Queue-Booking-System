// app/modules/booking/booking.controller.ts
import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { createBooking } from "./booking.service";

export const createBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const { eventId } = req.body;
    const userId = (req.user as { userId: string })?.userId;
    const booking = await createBooking(eventId, userId);
    res.status(201).json({ success: true, data: booking });
  }
);
