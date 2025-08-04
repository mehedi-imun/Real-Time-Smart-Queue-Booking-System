import { createClient } from "redis";
import { envVars } from "./env";

// Redis client for general use
export const redisClient = createClient({
  username: envVars.REDIS_USERNAME,
  password: envVars.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS_HOST,
    port: Number(envVars.REDIS_PORT),
  },
});

// Redis connection options for BullMQ or Socket.IO adapter
export const redisConnection = {
  host: envVars.REDIS_HOST,
  port: Number(envVars.REDIS_PORT),
  username: envVars.REDIS_USERNAME,
  password: envVars.REDIS_PASSWORD,
};

// Logging error
redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

// Connection helper
export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis Connected");
  }
};
