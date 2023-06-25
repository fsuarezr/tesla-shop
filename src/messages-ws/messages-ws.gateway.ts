import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets"
import { MessagesWsService } from "./messages-ws.service"
import { Server, Socket } from "socket.io"
import { NewMessageDto } from "./dtos/new-message.dto"
import { JwtService } from "@nestjs/jwt"
import { JwtPayload } from "src/auth/interfaces"

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wsS: Server

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    let payload: JwtPayload
    const token = client.handshake.headers.authentication as string

    try {
      payload = this.jwtService.verify(token)
      await this.messagesWsService.registerClient(client, payload.id)
    } catch (error) {
      client.disconnect()
      return
    }

    this.wsS.emit(
      `clients-updated`,
      this.messagesWsService.getConnectedClients(),
    )
  }

  handleDisconnect(client: Socket) {
    // console.log(`Cliente desconectado ${client.id}`)
    this.messagesWsService.removeClient(client.id)

    this.wsS.emit(
      `clients-updated`,
      this.messagesWsService.getConnectedClients(),
    )
  }

  @SubscribeMessage(`message-from-client`)
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite únicamente al cliente
    // client.emit(`message-from-server`, {
    //   fullName: `holis`,
    //   message: payload.message,
    // })

    //! Emite a TODOS menos al cliente inicial
    // client.broadcast.emit(`message-from-server`, {
    //   fullName: `holis`,
    //   message: payload.message,
    // })

    //EMITIR A TODOS
    this.wsS.emit(`message-from-server`, {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message,
    })
  }
}
