import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RD_HOSTNAME || 'localhost',
  port: parseInt(process.env.RDS_PORT, 10) || 5432,
  username: process.env.RDS_USERNAME || 'howabout',
  password: process.env.RDS_PASSWORD || 'howabout',
  database: process.env.RDS_DB_NAME || 'howabout',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};
