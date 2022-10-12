import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RD_HOSTNAME || 'localhost',
  port: 5432,
  username: process.env.RDS_USERNAME || 'testuser',
  password: process.env.RDS_PASSWORD || '1234',
  database: process.env.RDS_DB_NAME || 'test_db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};
