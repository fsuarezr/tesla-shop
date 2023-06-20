import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PassportModule } from "@nestjs/passport"
import { ConfigModule, ConfigService } from "@nestjs/config"

import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"

import { User } from "./entities/user.entity"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        defaultStrategy: configService.get<string>(`auth.defaultStrategy`),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(`auth.jwtSecret`),
        signOptions: {
          expiresIn: configService.get<string>(`auth.jwtExpiresIn`),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, JwtModule, PassportModule, TypeOrmModule],
})
export class AuthModule {}
