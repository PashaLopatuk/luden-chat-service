import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {IRequest} from "../types/request";

@Injectable()
export abstract class BaseAuthGuard {
  protected constructor(private readonly jwtService: JwtService) {
  }

  processToken(
    {
      token
    }: {
      token: string | null
    }) {

    if (!token) {
      throw new UnauthorizedException("Invalid token")
    }

    return this.extractUserIdJwt(token)
  }

  extractUserIdJwt(token: string) {
    try {
      const payload = this.jwtService.verify(token)

      return payload.userId
    } catch (err) {
      Logger.error(err.message)
      throw new UnauthorizedException("Invalid token")
    }
  }
}