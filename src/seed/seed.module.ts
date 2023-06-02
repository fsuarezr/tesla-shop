import { Module } from "@nestjs/common"
import { SeedService } from "./seed.service"
import { SeedController } from "./seed.controller"
import { ProductsModule } from "src/products/products.module"

@Module({
  imports: [ProductsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
