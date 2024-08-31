import {
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {SocketModule} from "@nestjs/websockets/socket-module";
import {Socket, Server} from 'socket.io'

@WebSocketGateway(8001, {
  cors: {
    origin: '*'
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  handleConnection(client: Socket) {
    client.broadcast.emit('user-join', {
      message: `New user joined the chat: ${client.id}`
    })
  }

  handleDisconnect(client: Socket) {
    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`
    })
  }


  @SubscribeMessage('newMessage')
  handleMessage(client: Socket, message: any) {
    client.broadcast.emit('message', `${client.id}: ${message}`)
  }
}