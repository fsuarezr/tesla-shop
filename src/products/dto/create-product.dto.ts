import { ApiProperty } from "@nestjs/swagger"
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from "class-validator"

export class CreateProductDto {
  @ApiProperty({
    uniqueItems: true,
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  sizes: string[]

  @ApiProperty()
  @IsIn([`men`, `women`, `unisex`, `kid`])
  gender: string

  @ApiProperty({ nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string

  @ApiProperty({ nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number

  @ApiProperty({ nullable: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[]

  @ApiProperty({ nullable: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[]
}
