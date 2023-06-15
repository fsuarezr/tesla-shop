import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateuserDto } from "./dto/create-user.dto"

@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`register`)
  create(@Body() createUserDto: CreateuserDto) {
    return this.authService.create(createUserDto)
  }
}
