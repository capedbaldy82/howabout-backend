import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  private logger = new Logger('Product');
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const products = this.productRepository.find();

    console.log(products);

    this.logger.verbose(`Payload: ${JSON.stringify(products)}`);

    if (!products) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    }

    return products;
  }

  async getProductById(id: number): Promise<Product> {
    const found = await this.productRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException('해당 상품은 존재하지 않습니다.');
    }

    return found;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }

  async deleteProduct(id: number): Promise<void | string> {
    return this.productRepository.deleteProduct(id);
  }
}
