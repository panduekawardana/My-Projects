// Extends Express Request type untuk menambahkan user dari JWT


import "express";

declare module "express-save-static-code" {
  interface Request {
    user?: {
      sub: number,
      email: string,
      iat?: number,
      exp?: number;
    }
  }
}