import { CustomRepository } from 'src/libs/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@CustomRepository(Product)
export class ProductRepository extends Repository<Product> {}
