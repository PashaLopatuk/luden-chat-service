import {Module} from "@nestjs/common";
import {messageProviders} from "../providers/message.providers";
import {MessageService} from "./message.service";
import {DatabaseModule} from "../database/database.module";
import {MessageController} from "./message.controller";
import {chatProviders} from "../providers/chat.providers";

@Module({
  providers: [
    ...messageProviders,
    ...chatProviders,
    MessageService,
  ],
  imports: [DatabaseModule],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}