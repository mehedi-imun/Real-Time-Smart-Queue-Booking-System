/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as eventService from "./event.service";

export const createEvent = catchAsync(async (req: Request, res: Response) => {

  const createdBy = (req.user as { userId: string })?.userId;
  if (req.file) {
    req.body.image = req.file.path;
  }
  const event = await eventService.createEvent({ ...req.body, createdBy });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Event created successfully",
    data: event,
  });
});

export const getAllEvents = catchAsync(async (_req: Request, res: Response) => {
  const events = await eventService.getAllEvents();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Events fetched successfully",
    data: events,
  });
});

export const getSingleEvent = catchAsync(
  async (req: Request, res: Response) => {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      res.status(httpStatus.NOT_FOUND).json({ message: "Event not found" });
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Event fetched successfully",
      data: event,
    });
  }
);

export const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const event = await eventService.updateEvent(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event updated successfully",
    data: event,
  });
});

export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  await eventService.deleteEvent(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Event deleted successfully",
    data: undefined
  });
});
