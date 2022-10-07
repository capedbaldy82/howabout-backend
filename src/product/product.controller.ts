import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  getProduct(): string {
    return 'test: a product';
  }

  @Get('/all')
  getAllProducts(): string {
    return 'test: all products';
  }

  @Post('/')
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: number): Promise<void | string> {
    return this.productService.deleteProduct(id);
  }
}
