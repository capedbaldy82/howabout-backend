import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/auth.repository';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmExModule } from 'src/libs/typeorm-ex.module';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ProductRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmExModule],
})
export class ProductModule {}
