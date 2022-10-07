import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'libs/typeorm-ex.module';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
