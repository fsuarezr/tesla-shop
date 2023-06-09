import { Response } from "express"
import { FileInterceptor } from "@nestjs/platform-express"
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { diskStorage } from "multer"

import { FilesService } from "./files.service"
import { fileFilter, fileNamer } from "./helpers/"

@Controller(`files`)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get(`product/:imageName`)
  findProductImage(
    @Res() response: Response,
    @Param(`imageName`) imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName)

    response.sendFile(path)
  }

  @Post(`product`)
  @UseInterceptors(
    FileInterceptor(`file`, {
      fileFilter: fileFilter,
      limits: { fieldSize: 2000 },
      storage: diskStorage({
        destination: `./static/products`,
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException(
        `Please make sure that you're sending an image`,
      )

    console.log(this.configService.get(`api.hostApi`))

    const secureUrl = `${this.configService.get(`api.hostApi`)}/files/product/${
      file.filename
    }`

    return { secureUrl }
  }
}
