import { Module } from '@nestjs/common';
import {ChatGateway} from "./chat-gateway";
import {DatabaseModule} from "../database/database.module";
import {chatProviders} from "../providers/chat.providers";
import {ChatController} from "./chat.controller";
import {ChatService} from "./chat.service";
import {userProviders} from "../providers/user.providers";



@Module({
  providers: [
    ...chatProviders,
    ...userProviders,
    ChatGateway,
    ChatService,
  ],
  imports: [
    DatabaseModule,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
