import { Request, Response } from "express";
import express from "express";
import { userRoutes } from "./app/modules/user/user.route";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

// User Apis

app.use("/api/v1/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  try {
    res.send({
      success: true,
      message: "server is running...🏃‍♂️‍➡️🏃‍♂️‍➡️🏃‍♂️‍➡️🏃‍♂️‍➡️🛣️",
    });
  } catch {
    res.send({
      success: true,
      message: "server is not running...🥹🥹👩‍🦽‍➡️👩‍🦽‍➡️🛣️",
    });
  }
});

export default app;
