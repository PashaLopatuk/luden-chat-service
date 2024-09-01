import {Controller, Get, Param, Post, Req} from "@nestjs/common";
import {MessageService} from "./message.service";
import {IRequest} from "../types/request";

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatId')
  getMessages(
    @Param('chatId') chatId: number,
    @Req() {userId}: IRequest,
  ) {
    return this.messageService.getMessages({
      userId: userId,
      chatId: chatId
    })
  }
}