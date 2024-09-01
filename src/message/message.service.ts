import {ForbiddenException, Inject, Injectable, NotFoundException, UnprocessableEntityException} from "@nestjs/common";
import {Repository} from "typeorm";
import {Chat} from "../entities/chat.entity";
import {Message} from "../entities/message.entity";
import {MessageDto} from "./dto/message.dto";
import {User} from "../entities/user.entity";

@Injectable()
export class MessageService {
  constructor(
    @Inject('MESSAGE_REPOSITORY') private messageRepository: Repository<Message>,
    @Inject('CHAT_REPOSITORY') private chatRepository: Repository<Chat>,
  ) {
  }

  async addMessage(
    {
      userId, message: {chatId, content}
    }: {
      message: MessageDto
      userId: number
    }) {
    if (!chatId) {
      throw new UnprocessableEntityException('Chat id was not provided');
    }

    const chat = await this.chatRepository.findOne({
      where: {
        id: chatId,
      },
      relations: ['users']
    })

    if (!chat) {
      throw new NotFoundException('Chat not found')
    }
    if (!chat.users.find(el => el.userId === userId)) {
      throw new ForbiddenException('You are not allowed to send message to this chat')
    }

    const newMessage = await this.messageRepository.insert({
      chat: chat,
      content: content,
      createdAt: new Date()
    })

    return newMessage
  }

  getMessages(
    {
      chatId, userId
    }: {
      chatId: number
      userId: number
    }) {
    return this.messageRepository.findBy({
      chat: {
        id: chatId,
        users: {
          userId: userId
        }
      }
    })
  }
}