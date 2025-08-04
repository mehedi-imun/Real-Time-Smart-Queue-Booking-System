// modules/queue/queue.route.ts
import express from "express";
import * as queueController from "./queue.controller";

const router = express.Router();

router.post("/", queueController.createQueue);
router.get("/", queueController.getAllQueues);
router.get("/:id", queueController.getSingleQueue);
router.patch("/:id", queueController.updateQueue);
router.delete("/:id", queueController.deleteQueue);

export const QueueRoutes = router;
