import { Module } from "@nestjs/common"
import { CoreModule } from "./core/core.module"
import { ProductsModule } from "./products/products.module"
import { CommonModule } from "./common/common.module"
import { SeedModule } from "./seed/seed.module"

@Module({
  imports: [CoreModule, ProductsModule, CommonModule, SeedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
