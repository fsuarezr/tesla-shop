import { Product } from "../../products/entities"
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

@Entity(`users`)
export class User {
  @PrimaryGeneratedColumn(`uuid`)
  id: string

  @Column({
    type: `text`,
    unique: true,
    select: false,
  })
  email: string

  @Column({
    type: `text`,
  })
  password: string

  @Column({
    type: `text`,
  })
  fullName: string

  @Column({
    type: `bool`,
    default: true,
  })
  isActive: boolean

  @Column({
    type: `text`,
    array: true,
    default: [`user`],
  })
  roles: string[]

  @OneToMany(() => Product, (product) => product.user)
  product: Product

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim()
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert()
  }
}
