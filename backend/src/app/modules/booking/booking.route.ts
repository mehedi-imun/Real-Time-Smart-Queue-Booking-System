// app/modules/booking/booking.route.ts
import express from "express";
import { createBookingController } from "./booking.controller";
const router = express.Router();

router.post("/", createBookingController); 

export default router;
