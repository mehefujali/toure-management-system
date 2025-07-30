import { NextFunction, Request, Response } from "express";

type AsyncHandeler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  (fn: AsyncHandeler) => (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
      next(error);
    });
  };

export default catchAsync;
