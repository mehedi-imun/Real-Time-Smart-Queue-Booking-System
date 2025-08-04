// modules/queue/queue.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as queueService from "./queue.service";

export const createQueue = catchAsync(async (req: Request, res: Response) => {
  const createdBy = (req.user as { userId: string })?.userId;
  const queue = await queueService.createQueue({ ...req.body, createdBy });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Queue created successfully",
    data: queue,
  });
});

export const getAllQueues = catchAsync(async (_req, res) => {
  const queues = await queueService.getAllQueues();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Queues fetched successfully",
    data: queues,
  });
});

export const getSingleQueue = catchAsync(async (req, res) => {
  const queue = await queueService.getQueueById(req.params.id);
  if (!queue) {
    res.status(httpStatus.NOT_FOUND).json({ message: "Queue not found" });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Queue fetched successfully",
    data: queue,
  });
});

export const updateQueue = catchAsync(async (req, res) => {
  const updated = await queueService.updateQueue(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Queue updated successfully",
    data: updated,
  });
});

export const deleteQueue = catchAsync(async (req, res) => {
  await queueService.deleteQueue(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Queue deleted successfully",
    data: undefined,
  });
});
