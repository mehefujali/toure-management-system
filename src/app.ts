import { Request, Response } from "express";
import express from "express";

const app = express();

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
