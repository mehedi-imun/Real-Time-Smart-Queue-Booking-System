import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawData =
        typeof req.body.data === "string"
          ? JSON.parse(req.body?.data)
          : req.body;
      req.body = await schema.parseAsync(rawData);
      return next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
