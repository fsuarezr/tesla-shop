import { ApiProperty } from "@nestjs/swagger"
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ProductImage } from "./"
import { User } from "../../auth/entities/user.entity"

@Entity({
  name: `products`,
})
export class Product {
  @ApiProperty({
    example: `3fa85f64-5717-4562-b3fc-2c963f66afa6`,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn(`uuid`)
  id: string

  @ApiProperty({
    example: `Men’s Chill Crew Neck Sweatshirt`,
    uniqueItems: true,
  })
  @Column({
    type: `text`,
    unique: true,
  })
  title: string

  @ApiProperty({
    example: 75,
    default: 0,
  })
  @Column({
    type: `float`,
    default: 0,
  })
  price: number

  @ApiProperty({
    example: `Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.`,
    nullable: true,
  })
  @Column({
    type: `text`,
    nullable: true,
  })
  description: string

  @ApiProperty({
    example: `mens_chill_crew_neck_sweatshirt`,
    uniqueItems: true,
  })
  @Column({
    type: `text`,
    unique: true,
  })
  slug: string

  @ApiProperty({
    example: 7,
    default: 0,
  })
  @Column({
    type: `integer`,
    default: 0,
  })
  stock: number

  @ApiProperty({
    example: [`XS`, `S`, `M`, `L`, `XL`, `XXL`],
    isArray: true,
  })
  @Column({
    type: `text`,
    array: true,
  })
  sizes: string[]

  @ApiProperty({
    example: `men`,
  })
  @Column({
    type: `text`,
  })
  gender: string

  @ApiProperty({
    example: [`sweatshirt`],
    isArray: true,
    default: [],
  })
  @Column({
    type: `text`,
    array: true,
    default: [],
  })
  tags: string[]

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[]

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User

  @BeforeInsert()
  validateSlugInert() {
    if (!this.slug) this.slug = this.title

    this.slug = this.slug.toLowerCase().replaceAll(` `, `_`).replaceAll(`'`, ``)
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug.toLowerCase().replaceAll(` `, `_`).replaceAll(`'`, ``)
  }
}
