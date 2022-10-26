import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CreateProductsDTO } from './dto/createProducts.dto';
import { UpdateProductsDTO } from './dto/updateProducts.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsServices: ProductsService) {}

    @Post() 
    create(@Body() req: CreateProductsDTO) {
        return this.productsServices.create()
    }

    @Get() 
    findAll() {
        return this.productsServices.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: number) {
        return this.productsServices.findOne(id)
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: number,
        @Body() req: UpdateProductsDTO) {
        return this.productsServices.update(id, req)
    }

}
