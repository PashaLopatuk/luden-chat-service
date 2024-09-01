import {Socket as SocketIO} from 'socket.io'

export interface Socket extends SocketIO {
  userId: number
}