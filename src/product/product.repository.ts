import { Logger, NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/libs/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@CustomRepository(Product)
export class ProductRepository extends Repository<Product> {
  private logger = new Logger('Product');

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, brand, type, image, status, until, rank, description } =
      createProductDto;

    const product = this.create({
      name,
      brand,
      type,
      image,
      status,
      until,
      rank,
      description,
    });

    await this.save(product);

    this.logger.verbose(`A product is created: ${name}`);

    return product;
  }

  async deleteProduct(id: number): Promise<void | string> {
    const result = await this.delete({ id });

    console.log(result);

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find product with id ${id}`);
    }

    this.logger.verbose(`A product is deleted: ${id}`);

    return `No.${id} Product is deleted`;
  }

  async reviseProduct(product: Product): Promise<{ ok: boolean; result: any }> {
    const { id } = product;

    const originProduct = await this.findOne({ where: { id } });

    if (!originProduct) {
      return { ok: false, result: '해당 제품은 존재하지 않습니다.' };
    }

    const result = await this.update(product.id, {
      name: product.name,
      brand: product.brand,
      type: product.type,
      image: product.image,
      status: product.status,
      until: product.until,
      rank: product.rank,
      description: product.description,
    });

    return { ok: true, result: result };
  }
}
