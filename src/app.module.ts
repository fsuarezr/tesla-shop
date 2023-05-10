import { Module } from "@nestjs/common"
import { CoreModule } from "./core/core.module"
import { ProductsModule } from "./products/products.module"
import { CommonModule } from "./common/common.module"

@Module({
  imports: [CoreModule, ProductsModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
