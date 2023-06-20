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
  @PrimaryGeneratedColumn(`uuid`)
  id: string

  @Column({
    type: `text`,
    unique: true,
  })
  title: string

  @Column({
    type: `float`,
    default: 0,
  })
  price: number

  @Column({
    type: `text`,
    nullable: true,
  })
  description: string

  @Column({
    type: `text`,
    unique: true,
  })
  slug: string

  @Column({
    type: `integer`,
    default: 0,
  })
  stock: number

  @Column({
    type: `text`,
    array: true,
  })
  sizes: string[]

  @Column({
    type: `text`,
  })
  gender: string

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
