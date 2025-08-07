import Queue from "bull";
import dotenv from "dotenv";
import { envVars } from "../../config/env";

dotenv.config();

export const bookingQueue = new Queue(
  "bookingQueue",
  envVars.REDIS_HOST as string
);

// Optional: Event listeners for logging/debugging
bookingQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

bookingQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});
