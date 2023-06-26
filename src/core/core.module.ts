import { Module } from "@nestjs/common"
import { MulterModule } from "@nestjs/platform-express"

import { EnvModule } from "./env.module"
import { PostgreSqlModule } from "./postgre-sql.module"

@Module({
  imports: [EnvModule, PostgreSqlModule, MulterModule.register()],
})
export class CoreModule {}
