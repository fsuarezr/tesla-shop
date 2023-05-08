import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MulterModule } from "@nestjs/platform-express"
import loadConfig from "./config/load-config"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `.env`,
      load: loadConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: `postgres`,
        host: configService.get<string>(`pgdb.host`),
        port: +configService.get<number>(`pgdb.port`),
        database: configService.get<string>(`pgdb.database`),
        username: configService.get<string>(`pgdb.username`),
        password: configService.get<string>(`pgdb.password`),
        autoLoadEntities: true,
        synchronize: true, // se recomienda tener este valor en true sólo para modo desarrollo
      }),
      inject: [ConfigService],
    }),
    MulterModule.register(),
  ],
})
export class CoreModule {}
