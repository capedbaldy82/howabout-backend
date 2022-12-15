import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { TypeOrmExModule } from 'src/libs/typeorm-ex.module';
import { UserRepository } from './auth.repository';
import { JwtStrategy } from './jwt.strategy';
import { ProductModule } from 'src/product/product.module';
import { ProductRepository } from 'src/product/product.repository';
import { ProductService } from 'src/product/product.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || config.get('jwt.secret'),
      signOptions: {
        expiresIn: 60 * 60,
      },
    }),
    TypeOrmExModule.forCustomRepository([UserRepository, ProductRepository]),
    forwardRef(() => ProductModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ProductService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
