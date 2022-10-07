import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'howabout',
  password: 'howabout',
  database: 'howabout',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
