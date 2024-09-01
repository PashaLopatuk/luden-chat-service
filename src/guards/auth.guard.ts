import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {IRequest} from "../types/request";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    const token = this.extractHeaderToken(request)

    if (!token) {
      throw new UnauthorizedException("Invalid token")
    }

    try {
      const payload = this.jwtService.verify(token)
      console.log('payload: ', payload)
      
      request.userId = payload.userId
      
    } catch (err) {
      Logger.error(err.message)
      throw new UnauthorizedException("Invalid token")
    }
    return true;
  }

  private extractHeaderToken(request: Request) {
    return request.headers.authorization?.split(' ')[1]
  }
}