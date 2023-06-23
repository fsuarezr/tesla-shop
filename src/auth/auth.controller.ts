import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

import { AuthService } from "./auth.service"
import { CreateuserDto, LoginUserDto } from "./dto"
import { Auth, GetUser } from "./decorators"
import { User } from "./entities/user.entity"

@ApiTags(`Auth`)
@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`register`)
  createUser(@Body() createUserDto: CreateuserDto) {
    return this.authService.createUser(createUserDto)
  }

  @Post(`login`)
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto)
  }

  @Get(`check-status`)
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user)
  }
}
