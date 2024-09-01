import { Module } from '@nestjs/common';
import {ChatGateway} from "./chat-gateway";
import {DatabaseModule} from "../database/database.module";
import {chatProviders} from "../providers/chat.providers";
import {ChatController} from "./chat.controller";
import {ChatService} from "./chat.service";
import {userProviders} from "../providers/user.providers";
import {MessageService} from "../message/message.service";
import {MessageModule} from "../message/message.module";



@Module({
  providers: [
    ...chatProviders,
    ...userProviders,
    ChatGateway,
    ChatService,
  ],
  imports: [
    DatabaseModule,
    MessageModule,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
