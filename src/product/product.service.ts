import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import fetch from 'node-fetch';
import { DeleteProductDto } from './dto/delete-product.dto';

@Injectable()
export class ProductService {
  private logger = new Logger('Product');
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.find();

    this.logger.verbose(`getAllProducts is called`);

    if (!products) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    }

    const sorted_porducts = products.sort((a, b) => a.id - b.id);

    return sorted_porducts;
  }

  async getProductById(id: number): Promise<Product> {
    const found = await this.productRepository.findOne({ where: { id } });

    this.logger.verbose(`getProductById is called with ${id}`);

    if (!found) {
      throw new NotFoundException(`${id}번 상품은 존재하지 않습니다.`);
    }

    return found;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }

  async deleteProduct(deleteProductDto: DeleteProductDto): Promise<any> {
    return this.productRepository.deleteProduct(deleteProductDto);
  }

  async deleteImage(image: string): Promise<any> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1/${image}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CF_TOKEN}`,
        },
      },
    );

    const result = await response.json();

    // @ts-ignore
    return { ok: result.success };
  }

  async getFileUploadURL() {
    console.log('requested UploadURL in Service');
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CF_TOKEN}`,
        },
      },
    );

    const result = await response.json();

    console.log(result);

    //@ts-ignore
    return { ok: true, ...result.result };
  }

  updateProduct = (product: Product): Promise<any> => {
    console.log('requested Update in Service');
    return this.productRepository.updateProduct(product);
  };
}
