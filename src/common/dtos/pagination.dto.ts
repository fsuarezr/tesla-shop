import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsPositive } from "class-validator"

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: `How many rows do you need`,
  })
  @IsOptional()
  @IsPositive()
  limit?: number

  @ApiProperty({
    default: 0,
    description: `How many rows do you want to skip`,
  })
  @IsOptional()
  @IsPositive()
  offset?: number
}
