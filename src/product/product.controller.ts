import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
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

  // 권한 필요

  @Post('/')
  @UseGuards(AuthGuard())
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Post('/delete')
  @UseGuards(AuthGuard())
  deleteProduct(@Body() deleteProductDto: DeleteProductDto): Promise<any> {
    return this.productService.deleteProduct(deleteProductDto);
  }

  @Post('/deleteimage')
  @UseGuards(AuthGuard())
  deleteImage(@Body('image') image: string): Promise<any> {
    return this.productService.deleteImage(image);
  }

  @Post('/fileurl')
  @UseGuards(AuthGuard())
  getFileUploadURL() {
    console.log('requested UploadURL in Controller');
    return this.productService.getFileUploadURL();
  }

  @Post('/revise')
  @UseGuards(AuthGuard())
  reviseProduct(@Body() product: Product): Promise<any> {
    console.log('requested Revise in Controller');
    return this.productService.reviseProduct(product);
  }
}
