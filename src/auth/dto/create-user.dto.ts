import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator"

export class CreateuserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `The password must have a Uppercase, lowercase letter and a number`,
  })
  password: string

  @IsString()
  @MinLength(10)
  fullName: string
}
