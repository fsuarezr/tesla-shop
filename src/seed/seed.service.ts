import { Injectable } from "@nestjs/common"
import { ProductsService } from "src/products/products.service"
import { initialData } from "./data/seed-data"

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.seedDatabase()

    return `Seed executed`
  }

  private async seedDatabase() {
    // Limpiando data existente de la BD
    await this.productsService.deleteAllProducts()

    const products = initialData.products

    const insertPromises = []

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product))
    })

    await Promise.all(insertPromises)

    return true
  }
}
