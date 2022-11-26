import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmExModule } from 'src/libs/typeorm-ex.module';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ProductRepository]),
    AuthModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
