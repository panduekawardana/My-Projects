import type { NextFunction, Request, Response } from "express";
import type { ZodError, ZodTypeAny } from "zod";

export function validate(
  schema: ZodTypeAny,
  target: "body" | "query" | "params" = "body"
){
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const parsed = schema.parse(data);
      req[target] = parsed
    } catch(err){
      next(err as ZodError)
    }
  }
}