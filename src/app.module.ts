import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { typeORMConfig } from './config/typeorm.config';
import { ProductModule } from './product/product.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), ProductModule],
  controllers: [AppController],
})
export class AppModule {}
