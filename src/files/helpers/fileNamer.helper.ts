import { v4 as uuid } from "uuid"

export const fileNamer = (
  re: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  // Si no existe el archivo, retorno false y no se sigue ejecutando la función
  if (!file) return callback(new Error(`File is empty`), false)

  const fileExtension = file.mimetype.split(`/`)[1]

  const fileName = `${uuid()}.${fileExtension}`

  callback(null, fileName)
}
