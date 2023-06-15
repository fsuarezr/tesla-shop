import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { CreateuserDto } from "./dto/create-user.dto"
import { User } from "./entities/user.entity"

@Injectable()
export class AuthService {
  private readonly logger = new Logger(`AuthService`)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateuserDto) {
    try {
      const user = this.userRepository.create(createUserDto)

      await this.userRepository.save(user)

      return user
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
  private handleDBExceptions(error: any): never {
    if (error.code === `23505`) throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException(
      `Unexpected error, check logs for more info`,
    )
  }
}
