import {BadRequestException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {SignupDTO} from "./dto/signup.dto";
import * as bcrypt from 'bcrypt'
import {LoginDTO} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";
import {v4} from 'uuid'
import {RefreshTokensDTO} from "./dto/refresh-tokens.dto";
import {Repository, MoreThanOrEqual} from "typeorm";
import {Chat} from "../entities/chat.entity";
import {UserTokens} from "../entities/user-tokens.entity";
import {User} from "../entities/user.entity";


@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    @Inject('USER_TOKENS_REPOSITORY') private userTokensRepository: Repository<UserTokens>,
    private jwtService: JwtService,
  ) {

  }

  async signup(signupData: SignupDTO) {
    const loginInUse = await this.userRepository.findOne({
      where: {
        login: signupData.login
      }
    })

    if (loginInUse) {
      throw new BadRequestException('Login is already in use')
    }

    const hashedPassword = await bcrypt.hash(signupData.password, 10)


    const user = this.userRepository.create({
      name: signupData.name,
      login: signupData.login,
      password: hashedPassword
    })

    const savedUser = await this.userRepository.save(user)

    const tokens = await this.generateUserTokens({
      userId: savedUser.userId
    })

    await this.storeRefreshToken({
      token: tokens.refreshToken,
      user: savedUser
    })

    return tokens
  }


  async login(credentials: LoginDTO) {
    const user = await this.userRepository.findOneBy({
      login: credentials.login
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedException('Password is wrong')
    }

    const tokens = await this.generateUserTokens({
      userId: user.userId
    })

    await this.storeRefreshToken({
      token: tokens.refreshToken,
      user: user
    })

    return tokens
  }

  async generateUserTokens({userId}: { userId }) {
    const accessToken = this.jwtService.sign({userId}, {expiresIn: '8h'})

    const refreshToken = v4()

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  async storeRefreshToken({token, user}: {
    token: string,
    user: User
  }) {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 3)

    const userTokens = await this.userTokensRepository.createQueryBuilder()
      .insert()
      .into(UserTokens)
      .values({
        user: user,
        expiryDate: expiryDate,
        token: token
      })
      .orUpdate(['expiryDate', 'token'], ['userId'])
      .execute();

    return userTokens
  }

  async refreshToken({refreshToken}: RefreshTokensDTO) {
    const token = await this.userTokensRepository.findOne({
      where: {
        token: refreshToken,
        expiryDate: MoreThanOrEqual(new Date)
      },
      withDeleted: true
    })

    if (!token) {
      throw new UnauthorizedException('Refresh token not found')
    }

    const tokens = await this.generateUserTokens({
      userId: token.user.userId
    })

    const user = await this.userRepository.findOne({
      where: {
        userId: token.user.userId
      }
    })

    await this.storeRefreshToken({
      token: tokens.refreshToken,
      user: user
    })

    return tokens
  }
}
