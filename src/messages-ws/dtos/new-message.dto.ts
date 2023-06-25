import { IsOptional, IsString, MinLength } from "class-validator"

export class NewMessageDto {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @MinLength(1)
  message: string
}
