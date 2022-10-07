import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  //   constructor(
  //     @InjectRepository(ProductRepository)
  //     private productRepository: ProductRepository,
  //   ) {}
  //   getProduct(): string {
  //     return 'a product';
  //   }
  //   async getAllProducts(): Promise<Product[]> {
  //     return this.productRepository.find();
  //   }
  //   createProduct(createProductDto: CreateProductDto): void {
  //     const { name, price, description } = createProductDto;
  //     console.log(`name: ${name}\nprice: ${price}\ndescription: ${description}`);
  //   }
}
