import { Module } from "@nestjs/common"
import { CoreModule } from "./core/core.module"
import { ProductsModule } from "./products/products.module"

@Module({
  imports: [CoreModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
