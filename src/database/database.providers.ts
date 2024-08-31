import { DataSource } from 'typeorm';
import config from "../config/config";

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (...args) => {
      console.log('args: ', args)
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: config().postgresDB.password,
        database: 'postgres',
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        logger: "simple-console",
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];