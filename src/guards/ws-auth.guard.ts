import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

import {BaseAuthGuard} from "./base-auth.guard";
import {Socket} from "../types/socket";
import {JwtService} from "@nestjs/jwt";

@Injectable()
// @ts-ignore
export class WSAuthGuard extends BaseAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    super(jwtService);
  }
  canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient()
    const token = client.request.headers.authorization.split(' ')[1]

    client.userId = super.processToken({
      token: token
    })

    return true
  }
}