import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {userProviders} from "../providers/user.providers";
import {userTokensProviders} from "../providers/user-tokens.providers";
import {DatabaseModule} from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...userProviders,
    ...userTokensProviders,
  ],
})
export class AuthModule {
}
