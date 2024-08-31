import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {SignupDTO} from "./dto/signup.dto";
import {LoginDTO} from "./dto/login.dto";
import {RefreshTokensDTO} from "./dto/refresh-tokens.dto";


@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signupData: SignupDTO) {
    return this.authService.signup(signupData)
  }

  @Post('login')
  async login(@Body() credentials: LoginDTO) {
    console.log('credentials: ', credentials)
    return this.authService.login(credentials)
  }

  @Post('refresh')
  async refresh(@Body() credentials: RefreshTokensDTO) {
    return this.authService.refreshToken(credentials)
  }
}
