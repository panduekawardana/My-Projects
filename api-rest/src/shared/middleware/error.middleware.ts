import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

export function ErrorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {

  if(err instanceof ZodError) {
    const errors = err.issues.map((issues) => {
      failed: issues.path.join(".") || "root"
      message: issues.message
    })

    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors,
    })
    return;
  }

  if(err instanceof AppError){
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}