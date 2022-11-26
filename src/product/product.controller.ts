import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get('/:id')
  getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Post('/')
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Post('/delete/:id')
  deleteProduct(@Param('id') id: number): Promise<void | string> {
    return this.productService.deleteProduct(id);
  }

  @Post('/revise')
  reviseProduct(
    @Body() product: Product,
  ): Promise<{ ok: boolean; result: any }> {
    return this.productService.reviseProduct(product);
  }
}
