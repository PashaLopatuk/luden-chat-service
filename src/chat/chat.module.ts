import { Module } from '@nestjs/common';
import {ChatGateway} from "./chat-gateway";
import {DatabaseModule} from "../database/database.module";
import {chatProviders} from "../providers/chat.providers";
import {ChatController} from "./chat.controller";
import {ChatService} from "./chat.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../auth/schemas/user.schema";


@Module({
  providers: [
    ...chatProviders,
    ChatGateway,
    ChatService,
  ],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
    ])
  ],
  controllers: [ChatController],
})
export class ChatModule {}
