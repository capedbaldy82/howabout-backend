import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  getProduct(): string {
    return this.productService.getProduct();
  }

  @Get('/all')
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Post('/')
  createProduct(@Body() createProductDto: CreateProductDto): void {
    return this.productService.createProduct(createProductDto);
  }
}
