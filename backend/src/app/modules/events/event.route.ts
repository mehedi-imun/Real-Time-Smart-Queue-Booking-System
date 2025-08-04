import express from "express";
import * as eventController from "./event.controller";

import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { createEventZodSchema } from "./event.validation";

const router = express.Router();

router.post(
  "/",
  multerUpload.single("file"),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createEventZodSchema),
  eventController.createEvent
);
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getSingleEvent);
router.patch(
  "/:id",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  eventController.updateEvent
);
router.delete(
  "/:id",
  checkAuth(...["SUPER_ADMIN"]),
  eventController.deleteEvent
);

export const EventRoutes = router;
