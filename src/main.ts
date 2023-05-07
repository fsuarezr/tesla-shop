import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Obteniendo variables de entorno
  const configService = app.get(ConfigService)
  const port = configService.get(`api.port`)
  const prefix = configService.get(`api.prefix`)

  app.setGlobalPrefix(prefix)

  await app.listen(port)
  console.log(`App running on port: ${port}`)
}
bootstrap()
