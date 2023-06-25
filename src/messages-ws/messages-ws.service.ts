import { Injectable } from "@nestjs/common"
import { ConnectedClients } from "./interfaces/clients.interface"
import { Socket } from "socket.io"
import { Repository } from "typeorm"
import { User } from "src/auth/entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class MessagesWsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private connectedClients: ConnectedClients = {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) throw new Error(`User not found`)
    if (!user.isActive) throw new Error(`User not active`)

    this.checkUserConnection(user)

    this.connectedClients[client.id] = { socket: client, user }
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId]
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients)
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClients = this.connectedClients[clientId]

      if (connectedClients.user.id === user.id) {
        connectedClients.socket.disconnect()
        break
      }
    }
  }
}
