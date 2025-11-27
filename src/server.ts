/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

import chalk from "chalk";
import figlet from "figlet";
import boxen from "boxen";
import gradient from "gradient-string";

const MONGO_URI =
  envVars.MONGO_URI || "mongodb://localhost:27017/tour-management-backend";
const PORT = envVars.PORT || 8080;

let server: Server;

// ✨ Custom Styled CLI Banner
const printBanner = () => {
  const title = figlet.textSync("TOUR API", {
    horizontalLayout: "full",
  });

  console.log(gradient.morning.multiline(title));

  const box = boxen(
    `
${chalk.green.bold("✔ EXPRESS SERVER RUNNING")}
${chalk.cyan("→ PORT:")} ${chalk.yellow(PORT)}
${chalk.cyan("→ DATABASE:")} ${chalk.green("MongoDB Connected")}
${chalk.cyan("→ STATUS:")} ${chalk.green("LIVE & READY")}
    `,
    {
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round",
      margin: 1,
    }
  );

  console.log(box);
};

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(chalk.bold.green("✔ MONGODB CONNECTED"));

    server = app.listen(PORT, () => {
      printBanner();
    });
  } catch (error) {
    console.log(chalk.red("✘ DB Connection Error: "), error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

/* ------------------------------------------------------------------
   Error Handling (unchanged logic)
------------------------------------------------------------------ */

process.on("unhandledRejection", (err) => {
  console.log(chalk.red("⚠️  Unhandled Rejection! Shutting down..."), err);

  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(chalk.red("💥 Uncaught Exception! Shutting down..."), err);

  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log(chalk.yellow("🔌 SIGTERM Received. Closing server..."));

  if (server) {
    server.close(() => process.exit(0));
  }
});

process.on("SIGINT", () => {
  console.log(chalk.yellow("🛑 SIGINT Received. Closing server..."));

  if (server) {
    server.close(() => process.exit(0));
  }
});
