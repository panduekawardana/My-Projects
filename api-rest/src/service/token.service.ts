import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../shared/errors/app-error.js";

export interface IJwtPayload {
  sub: number;
  email: string;
}

export interface ITokenService {
  sign(payload: IJwtPayload): string;
  verify(token: string): IJwtPayload;
}

interface DecodedToken {
  sub?: unknown;
  email?: unknown;
}

/**
 * TokenService: enkapsulasi logika JWT (sign/verify).
 * Konsep OOP: Encapsulation (secret tidak diekspos keluar class)
 */

export class TokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: NonNullable<SignOptions["expiresIn"]>;

  constructor() {
    this.secret = env.JWT_SECRET;
    this.expiresIn = env.JWT_ACCESS_EXPIRES as NonNullable<SignOptions["expiresIn"]>;
  }

  sign(payload: IJwtPayload): string {
    const option: SignOptions = {
      expiresIn: this.expiresIn,
    };
    return jwt.sign(payload, this.secret, option)
  }

  verify(token: string): IJwtPayload {
    let decoded: DecodedToken;

    try {
      decoded = jwt.verify(token, this.secret) as DecodedToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token expired");
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid token");
      }

      throw new UnauthorizedError("Unauthorized");
    }

    if (typeof decoded.sub !== "number") {
      throw new UnauthorizedError("Invalid token payload");
    }

    if (typeof decoded.email !== "string") {
      throw new UnauthorizedError("Invalid token payload");
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
    }
  }
}
