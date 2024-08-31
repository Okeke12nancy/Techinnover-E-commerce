import { DataSourceOptions } from 'typeorm';

export const getTypeOrmConfig = (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'your-username',
    password: process.env.DB_PASSWORD || 'your-password',
    database: process.env.DB_NAME || 'ecommerce',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  };
};
