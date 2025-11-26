/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

const MONGO_URI =
  envVars.MONGO_URI || "mongodb://localhost:27017/tour-management-backend";
const PORT = envVars.PORT || 8080;

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MONGODB CONNECTED");
    server = app.listen(PORT, () => {
      console.log("EXPRESS SERVER IS RUNNING ON PORT", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection dected server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("uncaughtException dected server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGTERM", () => {
  console.log("SIGTERM signal recived server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal recived server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Unhandled Rejection
// Promise.reject(new Error("I forget to catch this err"))

// Uncaught Exception
// throw new Error("I forget to handle this local err")
