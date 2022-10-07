import { CustomRepository } from 'src/libs/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@CustomRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, price, description } = createProductDto;

    const product = this.create({
      name,
      price,
      description,
    });

    await this.save(product);

    console.log('test: A product is created');

    return product;
  }
}
