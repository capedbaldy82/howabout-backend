import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async getProductById(id: number): Promise<Product> {
    const found = await this.productRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException('해당 상품은 존재하지 않습니다.');
    }

    return found;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.find();

    return products;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }

  async deleteProduct(id: number): Promise<void | string> {
    return this.productRepository.deleteProduct(id);
  }
}
