import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { ProductsService } from "src/products/products.service"
import { initialData } from "./data/seed-data"
import { User } from "src/auth/entities/user.entity"

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    // Limpiando data existente de la BD
    await this.deleteTables()
    const adminUser = await this.InsertUsers()
    await this.insertNewProducts(adminUser)

    return `Seed executed`
  }

  private async deleteTables() {
    // Eliminando tabla Productos
    await this.productsService.deleteAllProducts()

    // Eliminando tabla Usuarios
    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder.delete().where({}).execute()
    return
  }

  private async InsertUsers() {
    const seedUsers = initialData.users

    const users: User[] = []

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user))
    })

    const dbUsers = await this.userRepository.save(seedUsers)

    return dbUsers[0]
  }

  private async insertNewProducts(adminUser: User) {
    const products = initialData.products

    const insertPromises = []

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, adminUser))
    })

    await Promise.all(insertPromises)

    return true
  }
}
