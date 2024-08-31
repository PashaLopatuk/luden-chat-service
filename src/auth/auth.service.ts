import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User} from "./schemas/user.schema";
import {Model} from "mongoose";
import {SignupDTO} from "./dto/signup.dto";
import * as bcrypt from 'bcrypt'
import {LoginDTO} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";
import {v4} from 'uuid'
import {RefreshToken} from "./schemas/refresh-token.schema";
import {RefreshTokensDTO} from "./dto/refresh-tokens.dto";


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {

  }

  async signup(signupData: SignupDTO) {
    const loginInUse = await this.UserModel.findOne({
      login: signupData.login
    })

    if (!!loginInUse) {
      throw new BadRequestException('Login is already in use')
    }

    const hashedPassword = await bcrypt.hash(signupData.password, 10)

    const user = await this.UserModel.create({
      name: signupData.name,
      login: signupData.login,
      password: hashedPassword
    })

    const tokens = await this.generateUserTokens({
      userId: user._id
    })

    await this.storeRefreshToken({
      token: tokens.refreshToken,
      userId: user._id
    })

    return tokens
  }


  async login(credentials: LoginDTO) {
    const user = await this.UserModel.findOne({login: credentials.login})

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedException('Password is wrong')
    }

    const tokens = await this.generateUserTokens({
      userId: user._id
    })

    await this.storeRefreshToken({
      token: tokens.refreshToken,
      userId: user._id
    })

    return tokens
  }

  async generateUserTokens({userId}: { userId }) {
    const accessToken = this.jwtService.sign({userId}, {expiresIn: '1h'})

    const refreshToken = v4()

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  async storeRefreshToken({token, userId}: {
    token: string,
    userId
  }) {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 3)

    return await this.RefreshTokenModel.updateOne({
        userId: userId,
      },
      {
        $set: {
          expiryDate: expiryDate,
          token: token,
        },
      },
      {
        upsert: true
      }
    )
  }

  async refreshToken({refreshToken}: RefreshTokensDTO) {
    const token = await this.RefreshTokenModel.findOneAndDelete({
      token: refreshToken,
      expiryDate: {$gte: new Date()}
    })

    if (!token) {
      throw new UnauthorizedException('Refresh token not found')
    }

    const tokens = await this.generateUserTokens({
      userId: token.userId
    })

    await this.storeRefreshToken({
      token: tokens.refreshToken,
      userId: token.userId
    })

    return tokens
  }
}
