import { Module } from "@nestjs/common"
import { SeedService } from "./seed.service"
import { SeedController } from "./seed.controller"
import { ProductsModule } from "src/products/products.module"
import { AuthModule } from "src/auth/auth.module"

@Module({
  imports: [ProductsModule, AuthModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
