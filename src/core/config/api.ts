import { registerAs } from "@nestjs/config"

export default registerAs(`api`, () => {
  const enviroment = process.env.NODE_ENV || `dev`
  const port = process.env.APP_PORT || 3000
  const prefix = process.env.API_PREFIX

  return {
    enviroment,
    port,
    prefix,
  }
})
