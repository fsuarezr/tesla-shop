import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import * as bcrypt from "bcrypt"
import { JwtPayload } from "./interfaces/jwt-payload.interface"

import { User } from "./entities/user.entity"
import { CreateuserDto, LoginUserDto } from "./dto"

@Injectable()
export class AuthService {
  private readonly logger = new Logger(`AuthService`)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateuserDto) {
    try {
      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      })

      await this.userRepository.save(user)

      delete user.password

      return {
        ...user,
        token: this.getjwtToken({ id: user.id }),
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    })

    if (!user)
      throw new UnauthorizedException(`Credentials are not valid (email)`)

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credentials are not valid (password)`)

    return {
      ...user,
      token: this.getjwtToken({ id: user.id }),
    }
  }

  private getjwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)

    return token
  }

  private handleDBExceptions(error: any): never {
    if (error.code === `23505`) throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException(
      `Unexpected error, check logs for more info`,
    )
  }
}
