import * as process from "node:process";

export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET
  },
  mongoDB: {
    connectionString: process.env.MONGODB_CONNECTION_URL
  },
  postgresDB: {
    password: process.env.POSTGRES_PASSWORD
  }
})