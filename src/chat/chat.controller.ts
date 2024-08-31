import {Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import {ChatService} from "./chat.service";
import {CreateChatDTO} from "../auth/dto/create-chat.dto";
import {AuthGuard} from "../guards/auth.guard";


@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Post('createChat')
  async createChat(
    @Body() chatData: CreateChatDTO,
    @Req() req,
    ) {

    return this.chatService.createChat(chatData, req.userId)
  }
}