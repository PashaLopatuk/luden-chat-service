import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import {UserTokens} from "../entities/user-tokens.entity";

export const userTokensProviders = [
  {
    provide: 'USER_TOKENS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserTokens),
    inject: ['DATA_SOURCE'],
  },
];