import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [AppController],
})
export class AppModule {}
