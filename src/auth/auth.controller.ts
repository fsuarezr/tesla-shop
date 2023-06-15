import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateuserDto, LoginUserDto } from "./dto"

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
}
