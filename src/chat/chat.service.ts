import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {CreateChatDTO} from "../auth/dto/create-chat.dto";
import {Repository} from "typeorm";
import {Chat} from "../entities/chat.entity";
import {InjectModel} from "@nestjs/mongoose";
import {User} from "../auth/schemas/user.schema";
import {Model} from "mongoose";

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_REPOSITORY') private chatRepository: Repository<Chat>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async createChat({receiver, title, description}: CreateChatDTO, userId) {
    console.log('userId: ', userId)

    const userReceiver = await this.UserModel.findOne({
      login: receiver
    })

    if (!userReceiver) {
      throw new NotFoundException("User not found")
    }

    const chat = await this.chatRepository.create({
      createdAt: new Date(),
      description: description,
      title: title,
    })

    return chat
  }
}