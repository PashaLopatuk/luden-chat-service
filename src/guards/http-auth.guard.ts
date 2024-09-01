import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {IRequest} from "../types/request";
import {BaseAuthGuard} from "./base-auth.guard";

@Injectable()
// @ts-ignore
export class HttpAuthGuard extends BaseAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    super(jwtService)
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    const token = this.extractHeaderToken(request)

    request.userId = super.processToken({
      token: token
    })

    return true;
  }


  private extractHeaderToken(request: Request) {
    return request.headers.authorization?.split(' ')[1]
  }
}