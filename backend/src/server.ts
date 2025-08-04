/* eslint-disable no-console */
import { Server as HttpServer } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectRedis } from "./app/config/redis.config";
import { initSocketServer } from "./app/sockets/socket";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

const startServer = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected to MongoDB");

    // 2. Connect Redis
    await connectRedis();
    console.log("✅ Connected to Redis");

    // 3. Seed Super Admin
    await seedSuperAdmin();
    console.log("✅ Super Admin seeded");

    // 4. Start HTTP server
    const httpServer: HttpServer = app.listen(envVars.PORT, () => {
      console.log(`🚀 Server is running on port ${envVars.PORT}`);
    });

    // 5. Init Socket.IO after server is ready
    initSocketServer(httpServer);

    // Handle kill signals and unhandled errors
    process.on("SIGTERM", () => shutdown(httpServer, "SIGTERM"));
    process.on("SIGINT", () => shutdown(httpServer, "SIGINT"));
    process.on("unhandledRejection", (err) => {
      console.error("🔥 Unhandled Rejection:", err);
      shutdown(httpServer, "unhandledRejection");
    });
    process.on("uncaughtException", (err) => {
      console.error("🔥 Uncaught Exception:", err);
      shutdown(httpServer, "uncaughtException");
    });
  } catch (error) {
    console.error("❌ Startup Error:", error);
    process.exit(1);
  }
};

const shutdown = (server: HttpServer, reason: string) => {
  console.log(`🧨 Shutdown initiated by: ${reason}`);
  server.close(() => {
    console.log("🛑 Server closed");
    process.exit(1);
  });
};

startServer();
