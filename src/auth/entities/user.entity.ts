import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

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
}
