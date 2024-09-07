import { DataSource } from 'typeorm';
import config from '../config/config';

const dbConfig = config().postgresDB;

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.name,
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        logger: 'simple-console',
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
