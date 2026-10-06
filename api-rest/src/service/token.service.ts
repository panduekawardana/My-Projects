//
//
//
// export interface IJwtPayload {
//   sub: number;
//   email: string;
// }
//
// export interface ITokenService {
//   sign(payload: IJwtPayload): string;
//    verify(token: string): IJwtPayload;
// }
//
// /**
//  * TokenService: enkapsulasi logika JWT (sign/verify).
//  * Konsep OOP: Encapsulation (secret tidak diekspos keluar class)
//  */
//
// export class TokenService implements ITokenService {
//   private readonly secret: string;
//   private readonly expiresIn: SignOptions['expiresIn'];
//
//   constructor() {
//   }
// }