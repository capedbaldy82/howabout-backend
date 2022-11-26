import { Logger, NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/libs/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { Product } from './product.entity';
import fetch from 'node-fetch';

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

  async deleteProduct(deleteProductDto: DeleteProductDto): Promise<any> {
    const { id, image } = deleteProductDto;
    const deleteProduct = await this.delete({ id });

    console.log(deleteProduct);

    if (deleteProduct.affected === 0) {
      throw new NotFoundException(`Can't find product with id ${id}`);
    }

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

    this.logger.verbose(`A product is deleted: ${id}`);

    // @ts-ignore
    return { ok: result.success, product: deleteProduct };
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
