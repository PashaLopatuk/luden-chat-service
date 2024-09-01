import {Body, Controller, Get, Param, Post, Req, UseGuards} from "@nestjs/common";
import {ChatService} from "./chat.service";
import {CreateChatDTO} from "./dto/create-chat.dto";
import {HttpAuthGuard} from "../guards/http-auth.guard";
import {IRequest} from "../types/request";
import {AddUserToChatDto} from "./dto/add-user-to-chat.dto";


@UseGuards(HttpAuthGuard)
@Controller({
  path: 'chat',
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Post('create')
  async createChat(
    @Body() chatData: CreateChatDTO,
    @Req() req: IRequest,
  ) {
    console.log('req: ', req.userId)
    return this.chatService.createChat(chatData, req.userId)
  }

  @Get('getAll')
  async getAll(@Req() {userId}: IRequest) {
    return this.chatService.getAll(userId)
  }

  @Post('addUser')
  async addUserToChat(
    @Req() {userId}: IRequest,
    @Body() {chatId, receiverUserNickname}: AddUserToChatDto
  ) {
    return this.chatService.addUserToChat({
      chatId: chatId,
      hostUserId: userId,
      receiverUserNickname: receiverUserNickname
    })
  }

  @Get(':chatId')
  async getOne(@Req() {userId}: IRequest, @Param('chatId') chatId: number) {
    return this.chatService.getOneChat({
      userId: userId,
      chatId: chatId
    })
  }
}