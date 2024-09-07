import 'dotenv'
import * as process from "node:process";

export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET
  },
  postgresDB: {
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    name: process.env.POSTGRES_NAME,
    port: Number(process.env.POSTGRES_PORT),
  },
  api: {
    mainPort: process.env.MAIN_PORT,
    wsPort: Number(process.env.WS_PORT)
  }
})