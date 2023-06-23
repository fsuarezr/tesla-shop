import { NestFactory } from "@nestjs/core"
import { ConfigService } from "@nestjs/config"
import { Logger, ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger(`main`)

  // Obteniendo variables de entorno
  const configService = app.get(ConfigService)
  const port = configService.get(`api.port`)
  const prefix = configService.get(`api.prefix`)

  app.setGlobalPrefix(prefix)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  const config = new DocumentBuilder()
    .setTitle(`Teslo RESTFul API`)
    .setDescription(
      `Teslo API with endpoints to create products, add files(images) and managing useres with Auth`,
    )
    .setVersion(`1.0`)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(prefix, app, document)

  await app.listen(port)
  logger.log(`App running on port: ${port}`)
}
bootstrap()
