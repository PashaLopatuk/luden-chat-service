import {
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {SocketModule} from "@nestjs/websockets/socket-module";
import {Server} from 'socket.io'

import {WSAuthGuard} from "../guards/ws-auth.guard";
import {Socket} from "../types/socket";
import {JwtService} from "@nestjs/jwt";
import {Logger, UnauthorizedException, UnprocessableEntityException} from "@nestjs/common";
import {MessageService} from "../message/message.service";
import {MessageDto} from "../message/dto/message.dto";
import {validate} from "class-validator";
import {ChatService} from "./chat.service";
import config from "../config/config";

const WSPort = (config().api.wsPort)

@WebSocketGateway(WSPort, {
  cors: {
    origin: '*'
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  authGuard: WSAuthGuard

  private clients: Set<Socket> = new Set()

  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
  ) {
    this.authGuard = new WSAuthGuard(jwtService)
  }

  handleConnection(client: Socket) {
    try {
      this.authGuard.canActivate({
        switchToWs: () => ({
          getClient: () => (client)
        })
      } as any)
    } catch (err) {
      Logger.error('Unauthorized')
      client.disconnect(true)
      return
    }

    this.clients.add(client)
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client)
  }


  @SubscribeMessage('newMessage')
  async handleMessage(client: Socket, message: string) {
    message = JSON.parse(message)

    if (!message || (typeof message !== 'object')) {
      client.emit('error', {
        error: 'Validation error!'
      })

      return
    }

    const err = await validate(message)

    console.log('err: ', err)

    try {
      if (!message) {
        throw new UnprocessableEntityException()
      }

      const newMessage = await this.messageService.addMessage({
        message: message,
        userId: client.userId,
      })

      const chat = await this.chatService.getOneChat({
        userId: client.userId, chatId: (message as any).chatId
      })

      for (const connection of this.clients) {
        if (chat.users.find(user => user.userId === connection.userId)) {
          connection.emit('newMessage', newMessage)
        }
      }

      client.send(newMessage)
    } catch (err) {
      client.emit('error', {
        error: err.message
      })
    }

  }
}