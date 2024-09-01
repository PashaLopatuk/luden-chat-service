import {ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {CreateChatDTO} from "./dto/create-chat.dto";
import {FindOperator, Repository} from "typeorm";
import {Chat} from "../entities/chat.entity";
import {UserTokens} from "../entities/user-tokens.entity";
import {User} from "../entities/user.entity";
import {MessageService} from "../message/message.service";


@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_REPOSITORY') private chatRepository: Repository<Chat>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly messageService: MessageService
  ) {
  }

  async createChat(
    {
      receiver,
      title,
      description
    }: CreateChatDTO,
    userId: number
  ) {
    let receiverUser;

    if (receiver) {
      receiverUser = await this.userRepository.findOneBy({
        login: receiver
      })
      if (!receiverUser) {
        throw new NotFoundException('User not found')
      }
    }

    const currentUser = await this.userRepository.findOneBy({
      userId: userId
    })

    const chat = this.chatRepository.create({
      createdAt: new Date(),
      title: title,
      description: description,
    });

    chat.users = [currentUser]

    if (receiverUser) {
      chat.users.push(receiverUser)
    }

    return this.chatRepository.save(chat)
  }


  async getAll(userId: number) {
    const userChatsRecords = await this.chatRepository.find({
      where: {
        users: {
          userId: userId
        }
      },
    })

    return userChatsRecords
  }

  async addUserToChat(
    {
      hostUserId,
      chatId,
      receiverUserNickname,
    }: {
      hostUserId: number,
      receiverUserNickname: string,
      chatId: number,
    }) {
    const hostUser = await this.userRepository.findOneBy({
      userId: hostUserId
    })

    const newUser = await this.userRepository.findOneBy({
      login: receiverUserNickname
    })

    if (!newUser) {
      throw new NotFoundException('User not found')
    }

    const chat = await this.chatRepository.findOne({
      where: {
        id: chatId
      }
    })

    if (!chat) {
      throw new NotFoundException('Chat not found')
    }

    if (!chat.users.includes(hostUser)) {
      throw new ForbiddenException('You are not in this chat')
    }
    chat.users.push(newUser)
    return this.chatRepository.save(chat)
  }

  async getOneChat(
    {userId, chatId}: {chatId: number, userId: number}
  ) {
    const user = await this.userRepository.findOneBy({userId: userId})
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['users']
    })

    if (!chat) {
      throw new NotFoundException('Chat not found')
    }
    if (!chat.users.some(u => u.userId === userId)) {
      throw new ForbiddenException('You are not allowed to this chat')
    }

    return chat
  }

  async userInChat({chatId, userId}: {chatId: number, userId: number}) {
    const chat = await this.chatRepository.findOneBy({
      users: {
        userId: userId
      },
      id: chatId
    })

    return !!chat
  }
}