import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  getProduct(): string {
    return 'product';
  }

  @Post('/')
  createProduct(@Body() createProductDto: CreateProductDto): void {
    const { name, price } = createProductDto;

    console.log(`name: ${name}\nprice: ${price}`);
  }
}
